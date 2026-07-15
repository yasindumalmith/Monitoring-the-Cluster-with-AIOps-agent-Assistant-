import structlog
from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from database import get_db_connection
from logging_config import configure_logging

class QueryRequest(BaseModel):
    text: str

configure_logging()
log = structlog.get_logger()

app = FastAPI(title="AI Ops Embedder Service", version="1.0.0")

log.info("loading.embedding.model", model="BAAI/bge-base-en-v1.5")
embedder = SentenceTransformer('BAAI/bge-base-en-v1.5')

@app.post("/v1/incidents/{incident_id}/embed")
async def embed_incident(incident_id: int):
    with get_db_connection() as conn:
        if not conn:
            return {"error": "Database connection failed"}
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT resource_name, namespace, issue, resolution_summary FROM incidents WHERE id = %s", (incident_id,))
            row = cursor.fetchone()
            if not row:
                return {"error": "Incident not found"}
            
            resource_name, namespace, issue, resolution_summary = row
            text_to_embed = f"Resource: {resource_name}\nNamespace: {namespace}\nIssue: {issue}\nResolution: {resolution_summary}"
            
            log.info("embedding.started", incident_id=incident_id)
            # Generate embedding
            embedding = embedder.encode(text_to_embed).tolist()
            
            # Save to DB
            cursor.execute("UPDATE incidents SET embedding = %s WHERE id = %s", (embedding, incident_id))
            conn.commit()
            log.info("embedding.success", incident_id=incident_id)
            return {"status": "success"}
        except Exception as e:
            log.error("embed.error", error=str(e))
            return {"error": str(e)}

@app.post("/v1/query/embed")
async def embed_query(req: QueryRequest):
    try:
        log.info("query.embedding.started", length=len(req.text))
        embedding = embedder.encode(req.text).tolist()
        return {"embedding": embedding}
    except Exception as e:
        log.error("query.embed.error", error=str(e))
        return {"error": str(e)}

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.get("/readyz")
async def readyz():
    return {"status": "ready"}
