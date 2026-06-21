# AI-Powered Kubernetes Operations Assistant

An intelligent AIOps platform that enables DevOps engineers and developers to monitor, troubleshoot, and manage Kubernetes clusters using natural language queries.

The platform combines AI-powered analysis, Kubernetes APIs, Prometheus metrics, and incident management workflows to provide actionable insights and automated diagnostics.

---

## Features

* AI-powered Kubernetes troubleshooting and diagnostics
* Natural language cluster queries
* Pod, Deployment, Node, Event, and Log inspection
* Incident detection and logging
* Prometheus metrics integration
* Grafana dashboard visualization
* PostgreSQL-backed conversation and incident storage
* Human-readable remediation recommendations

---

## Architecture

```text
User
 │
 ▼
Frontend (React)
 │
 ▼
Backend API
 │
 ▼
AI Agent
 │
 ├── Kubernetes API
 ├── Prometheus
 └── PostgreSQL
```

---

## Workflow

1. User submits a natural language query.
2. AI agent determines which tools are required.
3. Kubernetes and Prometheus data are collected.
4. AI analyzes the results.
5. A human-readable response is generated.
6. Conversations and incidents are stored in PostgreSQL.

---

## Tech Stack

### Backend

* Python
* FastAPI
* Anthropic Claude API

### Container & Orchestration

* Kubernetes
* Minikube
* Docker

### Observability

* Prometheus
* Grafana
* ServiceMonitor

### Database

* PostgreSQL

### Frontend

* React
* Axios
* React Router

### Security

* JWT Authentication

### Version Control

* Git
* GitHub

---

## Database Schema

### Conversations

Stores user questions and AI-generated responses.

### Tool Calls

Stores executed tools, inputs, outputs, and execution duration.

### Incidents

Stores detected cluster incidents including:

* Resource Name
* Namespace
* Severity
* Issue Description
* Timestamp

---

## Example Queries

```text
Check cluster health
```

```text
Show failing pods
```

```text
Why is my pod restarting?
```

```text
Analyze deployment failures
```

```text
Show CPU usage for running pods
```

---

## Monitoring

Prometheus collects application and cluster metrics.

Grafana visualizes:

* CPU Usage
* Memory Usage
* Pod Health
* Cluster Status
* Application Metrics

---

## Future Enhancements

* Email notifications for incidents
* Role-based access control
* Multi-cluster support
* Historical analytics dashboard
* Real-time notifications
* Automated remediation workflows

---

## Project Goals

* Simplify Kubernetes troubleshooting
* Improve operational visibility
* Accelerate incident investigation
* Enable conversational cluster management
* Demonstrate practical AIOps capabilities

---

## Author

Developed as a Kubernetes-focused AIOps platform for intelligent cluster monitoring, incident detection, and operational assistance.
