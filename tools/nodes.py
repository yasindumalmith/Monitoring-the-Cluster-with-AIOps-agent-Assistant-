from kubernetes import client, config

def _load_config():
    try:
        config.load_incluster_config()
    except config.ConfigException:
        config.load_kube_config()


_load_config()
v1 = client.CoreV1Api()


def node_health(node_name: str | None = None) -> dict:
    try:
        nodes = v1.list_node()
        result = []
        for node in nodes.items:
            if node_name and node.metadata.name != node_name:
                continue
            conditions = {c.type: c.status for c in (node.status.conditions or [])}
            capacity = node.status.capacity or {}
            allocatable = node.status.allocatable or {}
            result.append({
                "name": node.metadata.name,
                "ready": conditions.get("Ready") == "True",
                "memory_pressure": conditions.get("MemoryPressure") == "True",
                "disk_pressure": conditions.get("DiskPressure") == "True",
                "pid_pressure": conditions.get("PIDPressure") == "True",
                "capacity": {"cpu": capacity.get("cpu"), "memory": capacity.get("memory")},
                "allocatable": {"cpu": allocatable.get("cpu"), "memory": allocatable.get("memory")},
            })
        return {"nodes": result, "count": len(result)}
    except client.ApiException as e:
        return {"error": f"API error: {e.reason}"}