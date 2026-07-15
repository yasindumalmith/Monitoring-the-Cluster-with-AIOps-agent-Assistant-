# 🚀 AI-Powered Kubernetes Operations Assistant

An AI-powered AIOps platform that enables DevOps teams to monitor Kubernetes clusters, diagnose failures through natural language conversations, manage incidents, and receive real-time notifications.

Demo Link :- [https://www.youtube.com/watch?v=R4KLq3zCNtg](https://www.youtube.com/watch?v=R4KLq3zCNtg)

---

## ✨ Highlights

🔍 **AI-Powered Cluster Diagnostics**

- Troubleshoot Kubernetes issues using natural language.
- Automated root cause analysis for cluster failures.
- AI-generated incident summaries and recommendations.

⚡ **Real-Time Incident Detection**

- Detect CrashLoopBackOff, ImagePullBackOff, OOMKilled, and other failures.
- Automatic incident creation and tracking.
- Deduplication using incident fingerprinting.

🧠 **Retrieval-Augmented Generation (RAG)**

- Automatic vector embedding of historical incidents using SentenceTransformers.
- Similarity search via pgvector to retrieve past incident solutions.
- Microservice architecture with dedicated API Gateway and ML Embedder components.

🔔 **Live Notifications**

- Real-time incident alerts using Server-Sent Events (SSE).
- Dynamic notification bell updates.
- In-app toast notifications.

🛡️ **Role-Based Access Control**

- JWT Authentication.
- Admin, DevOps Engineer, and Developer roles.

📊 **Operational Dashboard**

- Cluster overview.
- Incident management dashboard.
- Chat history and diagnostics timeline.

---

## 🏗️ System Architecture

![Architecture](docs/Architecture1.png)

---

## 🎯 Key Features

### 🤖 AI Chat Assistant

Ask questions such as:

```text
Check cluster health
Why is my pod restarting?
Analyze deployment issues
Show node status
```

The AI agent automatically gathers Kubernetes data, analyzes the cluster, and provides actionable recommendations.

---

### 🚨 Incident Management

The platform automatically:

- Detects operational issues.
- Creates incidents.
- Prevents duplicate active incidents.
- Tracks incident lifecycle.
- Maintains historical incident records.

Supported states:

```text
OPEN → ACKNOWLEDGED → RESOLVED
```

---

### 🧠 Retrieval-Augmented Generation (RAG) Memory

The AI Agent learns from past incidents to solve future problems faster:

- **Automatic Embedding**: When an incident is resolved, a dedicated heavy ML worker (`ai-ops-embedder`) automatically generates a vector embedding of the problem and its solution using the `BAAI/bge-base-en-v1.5` model.
- **Vector Search**: The agent uses PostgreSQL with `pgvector` to perform similarity searches on historical data.
- **Proactive Troubleshooting**: Before diagnosing a cluster error, the AI searches the incident database to see if a similar CrashLoopBackOff or OOMKilled event occurred in the past, directly providing the proven resolution.
- **Decoupled Architecture**: The PyTorch embedding process is entirely decoupled from the main FastAPI server, guaranteeing performance, preventing Out-Of-Memory kills, and ensuring instant API startup times.

---

### 🔄 Real-Time Notification Pipeline

```text
Incident Detected
        │
        ▼
Python Agent
        │
        ▼
Webhook
        │
        ▼
Express Backend
        │
        ▼
SSE Broadcast
        │
        ▼
React Frontend
```

Users instantly receive:

- 🔔 Notification Bell Updates
- 📢 Toast Notifications
- 📋 Incident Dashboard Updates

---

## 🛠️ Tech Stack

| Category           | Technologies                      |
| ------------------ | --------------------------------- |
| Frontend           | React, React Router, Tailwind CSS |
| Backend            | Node.js, Express.js               |
| AI Agent           | Python, FastAPI, Anthropic LLM    |
| ML Embedder        | PyTorch, SentenceTransformers     |
| Database           | PostgreSQL, pgvector              |
| Container Platform | Kubernetes                        |
| Monitoring         | Prometheus, Grafana               |
| Authentication     | JWT                               |
| Notifications      | SSE (Server-Sent Events)          |

---

## 📂 Project Structure

```text
project-root/

├── frontend/
├── backend/
├── agent/
├── kubernetes/
└── database/
```

---

## 📸 Screenshots

Add screenshots here after completing the UI.

### Front Page

![Front Page](docs/Page.png)

### AI Chat Assistant

![Chat](docs/AiChat.png)

### AI Real Time Incident Detect

![Incident](docs/Incident_Alert.png)

### Incident Dashboard

![Incident](docs/IncidentDashboard.png)

### Application Metrics Dashboard

![Grafana Dashboard](docs/GrafanaDashboard.png)

---

## 🚀 Future Improvements

- Email Notifications
- Slack / Microsoft Teams Integration
- Multi-Cluster Support
- Predictive Failure Detection
- AI-Generated Remediation Plans
- Redis Caching
- Advanced Incident Analytics

---

## 📚 Learning Outcomes

This project demonstrates practical experience in:

- Kubernetes Operations
- AIOps
- Incident Management
- Full-Stack Development
- Event-Driven Architectures
- Real-Time Notification Systems
- PostgreSQL Database Design
- Authentication & Authorization
- Monitoring & Observability

---

## ⭐ Project Goal

Build an intelligent Kubernetes operations platform that helps engineers detect, diagnose, and resolve infrastructure issues faster through AI-assisted workflows and real-time operational visibility.

-- create unique index

CREATE UNIQUE INDEX unique_open_incident ON incidents (fingerprint) WHERE status = 'open';
