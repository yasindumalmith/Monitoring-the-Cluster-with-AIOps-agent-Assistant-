import structlog

log = structlog.get_logger()

def log_cluster_incident(resource_name: str, namespace: str, severity: str, issueType: str, issue: str) -> dict:
    """
    Use this tool to officially log an incident when you discover a critical issue
    with a cluster resource. This tells the system that an alert has been formally recognized.

    Args:
        resource_name: The name of the failing resource (e.g., 'my-pod-123', 'worker-node-1')
        namespace: The namespace of the resource (use 'cluster-wide' for node issues)
        severity: The severity of the incident (e.g., 'high', 'medium', 'low')
        issueType: The specific type or category of the error. Examples include:
            - 'CrashLoopBackOff' (container keeps crashing)
            - 'ImagePullBackOff' / 'ErrImagePull' (cannot pull Docker image)
            - 'OOMKilled' (out of memory termination)
            - 'CreateContainerConfigError' (missing ConfigMap or Secret)
            - 'Evicted' (node ran out of disk/memory and kicked the pod out)
            - 'FailedScheduling' (no nodes have enough CPU/memory to host the pod)
            - 'NodeNotReady' (kubelet is down or network partitioned)
        issue: A brief description of what is wrong
    """
    log.info("incident.logged.by.agent", resource=resource_name, namespace=namespace, severity=severity, issueType=issueType)
    # We return success to the agent. The actual database insertion happens in main.py
    # where the DB connection pool lives!
    return {"status": "success", "message": f"Incident for {resource_name} logged successfully."}
