import json
import os
import uuid
from anthropic import Anthropic
from dotenv import load_dotenv
from kubernetes import client, config
from rich.console import Console
from rich.markdown import Markdown
import time
import structlog
from metrics import tool_calls_total, tokens_total, agent_iterations

from tools import TOOLS, TOOL_FUNCTIONS

load_dotenv()
console = Console()

def _load_config():
    try:
        config.load_incluster_config()
    except config.ConfigException:
        config.load_kube_config()

_load_config()
v1 = client.CoreV1Api()

log = structlog.get_logger()
anthropic_client = Anthropic()
MODEL = "claude-sonnet-4-6"



SYSTEM_PROMPT = """You are a Kubernetes operations assistant. You help engineers diagnose
issues in their cluster using read-only tools.

Operating rules:
- Always start broad: use get_pods or node_health to find the problem, then
  drill down with describe_resource and get_logs.
- For "why is X failing" questions, describe_resource is usually more useful
  than get_logs — events explain image pulls, crashes, scheduling failures.
- When you call get_logs, ask for small tail_lines (20–50) unless the user
  asks for more.
- If a tool returns an error, explain it in plain language and suggest what
  the user could check.
- Be concise. Use bullet points for findings. Don't restate raw tool output
  back to the user — summarize what matters."""


MAX_ITERATIONS = 10


def run_agent(messages: list, request_id: str = None) -> tuple[str, list, list]:
    """Run the agent loop. Returns (final_text, updated_messages, tool_calls)."""
    request_id = request_id or str(uuid.uuid4())
    agent_tool_calls = []
    for iteration in range(MAX_ITERATIONS):
        response = anthropic_client.messages.create(
            model=MODEL,
            max_tokens=2048,
            system=SYSTEM_PROMPT,
            tools=TOOLS,
            messages=messages,
        )

        tokens_total.labels(kind="input").inc(response.usage.input_tokens)
        tokens_total.labels(kind="output").inc(response.usage.output_tokens)
        log.info("llm.call",
                 request_id=request_id,
                 iteration=iteration,
                 stop_reason=response.stop_reason,
                 input_tokens=response.usage.input_tokens,
                 output_tokens=response.usage.output_tokens)

        if response.stop_reason == "end_turn":
            messages.append({"role": "assistant", "content": response.content})
            final_text = "".join(b.text for b in response.content if b.type == "text")
            return final_text, messages, agent_tool_calls

        if response.stop_reason == "tool_use":
            messages.append({"role": "assistant", "content": response.content})
            tool_results = []
            for block in response.content:
                if block.type == "tool_use":
                    console.print(f"[yellow]→ {block.name}({json.dumps(block.input)})[/yellow]")
                    func = TOOL_FUNCTIONS[block.name]
                    start = time.time()
                    try:
                        result = func(**block.input)
                        status = "error" if isinstance(result, dict) and "error" in result else "success"
                    except Exception as e:
                        result = {"error": f"Tool execution failed: {e}"}
                        status = "error"
                    preview = json.dumps(result)[:150]
                    console.print(f"[dim]  ↳ {preview}{'...' if len(preview) >= 150 else ''}[/dim]")
                    
                    
                    duration_ms = int((time.time() - start) * 1000)
                    tool_calls_total.labels(tool=block.name, status=status).inc()
                    log.info("tool.call",
                             request_id=request_id,
                             tool=block.name,
                             input=block.input,
                             status=status,
                             duration_ms=duration_ms)

                    agent_tool_calls.append({
                        "tool": block.name,
                        "input": block.input,
                        "result": result,
                        "duration_ms": duration_ms
                    })

                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": json.dumps(result),
                    })
            messages.append({"role": "user", "content": tool_results})
            continue

        return f"Unexpected stop_reason: {response.stop_reason}", messages, agent_tool_calls

    return "Hit max iterations without a final answer.", messages, agent_tool_calls


def main():
    console.print("[bold cyan]AI Ops Assistant — Phase 2[/bold cyan]")
    console.print("[dim]Multi-turn enabled. Type 'reset' to clear history, 'exit' to quit.[/dim]\n")

    messages = []

    while True:
        try:
            user_input = console.input("[bold green]you >[/bold green] ")
        except (EOFError, KeyboardInterrupt):
            break

        if user_input.lower() in {"exit", "quit"}:
            break
        if user_input.lower() == "reset":
            messages = []
            console.print("[dim]history cleared[/dim]\n")
            continue
        if not user_input.strip():
            continue

        messages.append({"role": "user", "content": user_input})
        answer, messages, _ = run_agent(messages)
        console.print()
        console.print(Markdown(answer))
        console.print()


if __name__ == "__main__":
    main()