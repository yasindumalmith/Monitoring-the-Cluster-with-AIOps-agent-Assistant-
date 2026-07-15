-- Enable pgvector for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Table for storing chat history
CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    chat_id UUID,
    request_id UUID,
    user_id INTEGER,
    user_role TEXT,
    question TEXT,
    answer TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for storing exact tool execution logs
CREATE TABLE tool_calls (
    id SERIAL PRIMARY KEY,
    request_id UUID,
    tool_name TEXT,
    input_json JSONB,
    output_json JSONB,
    duration_ms INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for tracking cluster incidents
CREATE TABLE incidents (
    id SERIAL PRIMARY KEY,
    detected_by_user_id INTEGER,
    resource_name TEXT,
    namespace TEXT,
    severity TEXT,
    issue TEXT,
    fingerprint TEXT,
    status TEXT DEFAULT 'open',
    resolution_summary TEXT,
    resolved_at TIMESTAMP,
    embedding vector(768),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Partial Unique Index to ensure deduplication of open incidents
CREATE UNIQUE INDEX unique_open_incident ON incidents (fingerprint) WHERE status = 'open';

-- Table for storing application users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
