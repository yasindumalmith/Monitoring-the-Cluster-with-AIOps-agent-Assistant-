from kubernetes import client, config

def _load_config():
    try:
        config.load_incluster_config()
    except config.ConfigException:
        config.load_kube_config()


_load_config()
v1 = client.CoreV1Api()


def describe_resource(name: str, namespace: str = "default",
                      kind: str = "pod") -> dict:
    try:
        if kind.lower() == "pod":
            pod = v1.read_namespaced_pod(name=name, namespace=namespace)
            events = v1.list_namespaced_event(
                namespace=namespace,
                field_selector=f"involvedObject.name={name}",
            )
            return {
                "name": name,
                "phase": pod.status.phase,
                "conditions": [
                    {"type": c.type, "status": c.status, "reason": c.reason}
                    for c in (pod.status.conditions or [])
                ],
                "container_statuses": [
                    {
                        "name": c.name,
                        "ready": c.ready,
                        "restart_count": c.restart_count,
                        "state": str(c.state) if c.state else None,
                    }
                    for c in (pod.status.container_statuses or [])
                ],
                "events": [
                    {
                        "type": e.type,
                        "reason": e.reason,
                        "message": e.message,
                        "count": e.count,
                    }
                    for e in events.items[-10:]  # last 10 events
                ],
            }
        return {"error": f"Kind '{kind}' not supported yet. Use 'pod'."}
    except client.ApiException as e:
        return {"error": f"API error: {e.reason}", "status": e.status}