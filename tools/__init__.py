from .pods import get_pods
from .logs import get_logs
from .describe import describe_resource
from .deployment import deployment_status
from .nodes import node_health
from .metrics import query_metrics
from .incident import log_cluster_incident

TOOL_FUNCTIONS = {
    "get_pods": get_pods,
    "get_logs": get_logs,
    "describe_resource": describe_resource,
    "deployment_status": deployment_status,
    "node_health": node_health,
    "query_metrics": query_metrics,
    "log_cluster_incident": log_cluster_incident,
}

TOOLS = [
    {
        "name": "get_pods",
        "description": (
            "List pods in a Kubernetes namespace with their phase, ready state, "
            "restart count, and node placement. Use this for general 'what is "
            "running' or 'what is failing' questions."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "namespace": {"type": "string", "description": "Kubernetes namespace. Defaults to 'default'."},
            },
            "required": [],
        },
    },
    {
        "name": "get_logs",
        "description": (
            "Fetch recent log lines from a specific pod. Returns up to 100 lines "
            "and 4000 characters — truncated from the start if longer. Use after "
            "get_pods or describe_resource has identified a problem pod."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "pod_name": {"type": "string", "description": "Exact pod name."},
                "namespace": {"type": "string", "description": "Defaults to 'default'."},
                "container": {"type": "string", "description": "Container name for multi-container pods."},
                "tail_lines": {"type": "integer", "description": "Lines to return (max 100, default 50)."},
            },
            "required": ["pod_name"],
        },
    },
    {
        "name": "describe_resource",
        "description": (
            "Get detailed status, conditions, and recent events for a Kubernetes "
            "resource. This is the most useful tool for diagnosing WHY a pod is "
            "failing — events show ImagePullBackOff, CrashLoopBackOff reasons, "
            "OOMKilled, scheduling failures, etc."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "name": {"type": "string", "description": "Resource name."},
                "namespace": {"type": "string", "description": "Defaults to 'default'."},
                "kind": {"type": "string", "description": "Resource kind. Currently only 'pod' is supported."},
            },
            "required": ["name"],
        },
    },
    {
        "name": "deployment_status",
        "description": (
            "Check a Deployment's rollout status — desired vs ready replicas, "
            "conditions, current image. Use when the user asks about a deployment "
            "rolling out, scaling, or being unhealthy."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "name": {"type": "string", "description": "Deployment name."},
                "namespace": {"type": "string", "description": "Defaults to 'default'."},
            },
            "required": ["name"],
        },
    },
    {
        "name": "node_health",
        "description": (
            "Get the health of cluster nodes — Ready status, memory/disk/PID "
            "pressure, CPU and memory capacity. Use for cluster-wide health or "
            "when investigating pods that won't schedule."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "node_name": {"type": "string", "description": "Specific node, or omit for all."},
            },
            "required": [],
        },
    },
    {
        "name": "query_metrics",
        "description": (
            "Run a PromQL query against Prometheus. Use for time-series questions "
            "like 'CPU usage of pod X', 'memory trend', 'request rate'. Examples: "
            "'sum(rate(container_cpu_usage_seconds_total{pod=\"foo\"}[5m]))', "
            "'kube_pod_container_status_restarts_total'."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "promql": {"type": "string", "description": "Valid PromQL expression."},
            },
            "required": ["promql"],
        },
    },
    {
        "name": "log_cluster_incident",
        "description": (
            "Use this tool to officially log an incident when you discover a critical issue "
            "with a cluster resource (like a CrashLoopBackOff pod or failing deployment). "
            "IMPORTANT: You MUST call this tool immediately whenever you find an issue. "
            "Do NOT ask the user for permission to log the incident, just do it automatically."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "resource_name": {"type": "string", "description": "The name of the failing resource (e.g., 'my-pod-123')"},
                "namespace": {"type": "string", "description": "The namespace of the resource"},
                "severity": {"type": "string", "description": "The severity of the incident (e.g., 'high', 'medium', 'low')"},
                "issue": {"type": "string", "description": "A brief description of what is wrong"},
            },
            "required": ["resource_name", "namespace", "severity", "issue"],
        },
    },
]