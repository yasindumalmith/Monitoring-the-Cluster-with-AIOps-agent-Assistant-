import structlog

log = structlog.get_logger()

def log_cluster_incident(resource_name: str, namespace: str, severity: str, issueType: str, issue: str) -> dict:
    """
    Use this tool to officially log an incident when you discover a critical issue
    with a cluster resource (like a CrashLoopBackOff pod or failing deployment).
    This tells the system that an alert has been formally recognized.

    Args:
        resource_name: The name of the failing resource (e.g., 'my-pod-123')
        namespace: The namespace of the resource
        severity: The severity of the incident (e.g., 'high', 'medium', 'low')
        issueType: The specific type or category of the error (e.g., 'CrashLoopBackOff', 'ImagePullBackOff', 'OOMKilled')
        issue: A brief description of what is wrong
    """
    log.info("incident.logged.by.agent", resource=resource_name, namespace=namespace, severity=severity, issueType=issueType)
    # We return success to the agent. The actual database insertion happens in main.py
    # where the DB connection pool lives!
    return {"status": "success", "message": f"Incident for {resource_name} logged successfully."}
