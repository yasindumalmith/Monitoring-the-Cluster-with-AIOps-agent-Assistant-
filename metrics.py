from prometheus_client import Counter, Histogram

requests_total = Counter(
    "aiops_requests_total",
    "Total chat requests",
    ["status"],
)

request_duration = Histogram(
    "aiops_request_duration_seconds",
    "Chat request duration",
    buckets=(0.5, 1, 2, 5, 10, 20, 30, 60),
)

tool_calls_total = Counter(
    "aiops_tool_calls_total",
    "Tool calls made by the agent",
    ["tool", "status"],
)

tokens_total = Counter(
    "aiops_tokens_total",
    "LLM tokens consumed",
    ["kind"],  # input / output
)

agent_iterations = Histogram(
    "aiops_agent_iterations",
    "Number of agent loop iterations per request",
    buckets=(1, 2, 3, 5, 8, 10),
)