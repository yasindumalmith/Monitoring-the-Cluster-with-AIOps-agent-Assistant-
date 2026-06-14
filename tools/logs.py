from kubernetes import client, config

def _load_config():
    try:
        config.load_incluster_config()
    except config.ConfigException:
        config.load_kube_config()


_load_config()
v1 = client.CoreV1Api()

MAX_LOG_CHARS = 4000
MAX_LOG_LINES = 100


def get_logs(pod_name: str, namespace: str = "default",
             container: str | None = None, tail_lines: int = 50) -> dict:
    tail_lines = min(tail_lines, MAX_LOG_LINES)
    try:
        logs = v1.read_namespaced_pod_log(
            name=pod_name,
            namespace=namespace,
            container=container,
            tail_lines=tail_lines,
        )
        truncated = False
        if len(logs) > MAX_LOG_CHARS:
            logs = logs[-MAX_LOG_CHARS:]
            truncated = True
        return {
            "pod": pod_name,
            "namespace": namespace,
            "lines_returned": len(logs.splitlines()),
            "truncated": truncated,
            "logs": logs,
        }
    except client.ApiException as e:
        return {"error": f"API error: {e.reason}", "status": e.status}
    except Exception as e:
        return {"error": str(e)}