import time
import uuid
import structlog
from fastapi import FastAPI, Request
from fastapi.responses import Response
from pydantic import BaseModel, Field
from typing import Any
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST

from agent import run_agent
from database import get_db_connection
from logging_config import configure_logging
from metrics import requests_total, request_duration

configure_logging()
log = structlog.get_logger()

app = FastAPI(title="AI Ops Assistant", version="1.0.0")


class Message(BaseModel):
    role: str
    content: str | list


class ChatRequest(BaseModel):
    messages: list[Message]


class ToolCallData(BaseModel):
    tool: str
    input: dict[str, Any]
    result: Any

class ChatResponse(BaseModel):
    request_id: str
    content: str
    tool_calls: list[ToolCallData] = Field(default_factory=list)


@app.middleware("http")
async def add_request_id(request: Request, call_next):
    request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
    structlog.contextvars.bind_contextvars(request_id=request_id)
    request.state.request_id = request_id
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    structlog.contextvars.clear_contextvars()
    return response


@app.post("/v1/chat", response_model=ChatResponse)
async def chat(req: ChatRequest, request: Request):
    request_id = request.state.request_id
    start = time.time()
    log.info("chat.request", message_count=len(req.messages))

    messages = [m.model_dump() for m in req.messages]
    try:
        answer, _, tool_calls = run_agent(messages, request_id)
        requests_total.labels(status="ok").inc()

        # Save to PostgreSQL Database
        user_question = req.messages[-1].content if req.messages else ""
        with get_db_connection() as conn:
            if conn:
                try:
                    cursor = conn.cursor()
                    cursor.execute(
                        "INSERT INTO conversations (request_id, question, answer) VALUES (%s, %s, %s)",
                        (request_id, str(user_question), answer)
                    )
                    conn.commit()
                    log.info("db.insert.success", table="conversations", request_id=request_id)
                except Exception as e:
                    log.error("db.insert.error", error=str(e))

        return ChatResponse(request_id=request_id, content=answer, tool_calls=tool_calls)
    except Exception as e:
        requests_total.labels(status="error").inc()
        log.exception("chat.error", error=str(e))
        raise
    finally:
        request_duration.observe(time.time() - start)


@app.get("/healthz")
async def healthz():
    return {"status": "ok"}


@app.get("/readyz")
async def readyz():
    return {"status": "ready"}


@app.get("/metrics")
async def metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)