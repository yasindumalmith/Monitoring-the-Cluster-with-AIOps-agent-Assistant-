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


def get_pods(namespace: str = "default") -> dict:
    """Actual tool implementation — talks to the K8s API."""
    try:
        pods = v1.list_namespaced_pod(namespace=namespace)
        result = []
        for pod in pods.items:
            container_statuses = pod.status.container_statuses or []
            restarts = sum(c.restart_count for c in container_statuses)
            result.append({
                "name": pod.metadata.name,
                "namespace": pod.metadata.namespace,
                "phase": pod.status.phase,
                "ready": all(c.ready for c in container_statuses) if container_statuses else False,
                "restarts": restarts,
                "node": pod.spec.node_name,
            })
        return {"pods": result, "count": len(result)}
    except Exception as e:
        return {"error": str(e)}


TOOLS = [
    {
        "name": "get_pods",
        "description": (
            "List all pods in a given Kubernetes namespace with their status, "
            "ready state, restart count, and which node they run on. "
            "Use this whenever the user asks about pod health, what is running, "
            "or what is failing in a namespace."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "namespace": {
                    "type": "string",
                    "description": "The Kubernetes namespace to query. Defaults to 'default' if not specified.",
                },
            },
            "required": [],
        },
    },
]

TOOL_FUNCTIONS = {
    "get_pods": get_pods,
}


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