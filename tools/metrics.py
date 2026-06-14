import requests

PROMETHEUS_URL = "http://localhost:9090"


def query_metrics(promql: str) -> dict:
    try:
        r = requests.get(
            f"{PROMETHEUS_URL}/api/v1/query",
            params={"query": promql},
            timeout=10,
        )
        r.raise_for_status()
        data = r.json()
        if data["status"] != "success":
            return {"error": data.get("error", "query failed")}
        # Trim long result sets — protect the context window
        result = data["data"]["result"][:20]
        return {
            "query": promql,
            "result_type": data["data"]["resultType"],
            "result_count": len(data["data"]["result"]),
            "results": result,
        }
    except requests.RequestException as e:
        return {"error": f"Prometheus unreachable: {e}"}