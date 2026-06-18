-- Table for storing chat history
CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    request_id UUID,
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
    resource_name TEXT,
    namespace TEXT,
    severity TEXT,
    issue TEXT,
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
