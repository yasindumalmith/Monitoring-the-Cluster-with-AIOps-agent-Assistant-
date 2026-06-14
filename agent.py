import json
import os
from anthropic import Anthropic
from dotenv import load_dotenv
from kubernetes import client, config
from rich.console import Console
from rich.markdown import Markdown

load_dotenv()
console = Console()

config.load_kube_config()
v1 = client.CoreV1Api()

anthropic_client = Anthropic()
MODEL = "claude-sonnet-4-20250514"



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


def run_agent(user_message: str) -> str:
    """Run the agent loop until Claude produces a final answer."""
    messages = [{"role": "user", "content": user_message}]

    while True:
        response = anthropic_client.messages.create(
            model=MODEL,
            max_tokens=1024,
            tools=TOOLS,
            messages=messages,
        )

        console.print(f"[dim]stop_reason: {response.stop_reason}[/dim]")

        if response.stop_reason == "end_turn":
            final_text = "".join(
                block.text for block in response.content if block.type == "text"
            )
            return final_text

        if response.stop_reason == "tool_use":
            messages.append({"role": "assistant", "content": response.content})

            tool_results = []
            for block in response.content:
                if block.type == "tool_use":
                    console.print(
                        f"[yellow]→ calling tool:[/yellow] {block.name}({json.dumps(block.input)})"
                    )
                    func = TOOL_FUNCTIONS[block.name]
                    result = func(**block.input)
                    console.print(f"[dim]   result: {json.dumps(result)[:200]}...[/dim]")

                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": json.dumps(result),
                    })

            messages.append({"role": "user", "content": tool_results})
            continue

        return f"Unexpected stop_reason: {response.stop_reason}"


def main():
    console.print("[bold cyan]AI Ops Assistant — Phase 1[/bold cyan]")
    console.print("[dim]Ask me about your cluster. Type 'exit' to quit.[/dim]\n")

    while True:
        try:
            user_input = console.input("[bold green]you >[/bold green] ")
        except (EOFError, KeyboardInterrupt):
            break

        if user_input.lower() in {"exit", "quit"}:
            break
        if not user_input.strip():
            continue

        answer = run_agent(user_input)
        console.print()
        console.print(Markdown(answer))
        console.print()


if __name__ == "__main__":
    main()