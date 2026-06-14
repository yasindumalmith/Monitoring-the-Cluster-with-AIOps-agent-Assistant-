from kubernetes import client, config

config.load_kube_config()
v1 = client.CoreV1Api()


def get_pods(namespace: str = "default") -> dict:
    try:
        pods = v1.list_namespaced_pod(namespace=namespace)
        result = []
        for pod in pods.items:
            statuses = pod.status.container_statuses or []
            restarts = sum(c.restart_count for c in statuses)
            result.append({
                "name": pod.metadata.name,
                "namespace": pod.metadata.namespace,
                "phase": pod.status.phase,
                "ready": all(c.ready for c in statuses) if statuses else False,
                "restarts": restarts,
                "node": pod.spec.node_name,
            })
        return {"pods": result, "count": len(result)}
    except Exception as e:
        return {"error": str(e)}