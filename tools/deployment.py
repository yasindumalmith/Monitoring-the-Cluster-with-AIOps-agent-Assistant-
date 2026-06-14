from kubernetes import client, config

def _load_config():
    try:
        config.load_incluster_config()
    except config.ConfigException:
        config.load_kube_config()


_load_config()
apps_v1 = client.AppsV1Api()


def deployment_status(name: str, namespace: str = "default") -> dict:
    try:
        d = apps_v1.read_namespaced_deployment(name=name, namespace=namespace)
        return {
            "name": name,
            "namespace": namespace,
            "replicas_desired": d.spec.replicas,
            "replicas_ready": d.status.ready_replicas or 0,
            "replicas_available": d.status.available_replicas or 0,
            "replicas_updated": d.status.updated_replicas or 0,
            "conditions": [
                {"type": c.type, "status": c.status, "reason": c.reason}
                for c in (d.status.conditions or [])
            ],
            "image": d.spec.template.spec.containers[0].image,
        }
    except client.ApiException as e:
        return {"error": f"API error: {e.reason}", "status": e.status}