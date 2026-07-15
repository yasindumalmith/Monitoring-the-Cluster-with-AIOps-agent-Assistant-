import os
import httpx
from database import get_db_connection

def search_past_incidents(query: str, limit: int = 5) -> dict:
    """
    Use this tool to search through historical incidents in the vector database
    to find similar problems and see how they were resolved. 
    """
    embedder_url = os.getenv("EMBEDDER_URL", "http://ai-ops-embedder.ai-ops.svc.cluster.local:8001")
    
    try:
        # 1. Get embedding for the search query
        with httpx.Client(timeout=30.0) as client:
            resp = client.post(f"{embedder_url}/v1/query/embed", json={"text": query})
            resp.raise_for_status()
            embedding = resp.json().get("embedding")
            
        if not embedding:
            return {"error": "Failed to generate embedding for the search query."}
            
        # 2. Search PostgreSQL database using pgvector
        with get_db_connection() as conn:
            if not conn:
                return {"error": "Database connection failed."}
            
            cursor = conn.cursor()
            # Calculate cosine similarity: 1 - (embedding <=> query_vector)
            cursor.execute(
                """
                SELECT resource_name, namespace, issue, resolution_summary, 1 - (embedding <=> %s::vector) as similarity
                FROM incidents 
                WHERE status = 'fixed' AND embedding IS NOT NULL
                ORDER BY embedding <=> %s::vector
                LIMIT %s
                """,
                (embedding, embedding, limit)
            )
            
            results = []
            for row in cursor.fetchall():
                results.append({
                    "resource_name": row[0],
                    "namespace": row[1],
                    "issue": row[2],
                    "resolution_summary": row[3],
                    "similarity_score": round(row[4], 3)
                })
                
            if not results:
                return {"message": "No relevant historical incidents found."}
                
            return {"past_incidents": results}
            
    except Exception as e:
        return {"error": f"Failed to search past incidents: {str(e)}"}
