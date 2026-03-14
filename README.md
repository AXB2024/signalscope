# 🌐 SignalScope

> Telecom outage monitoring platform for reporting and visualizing network issues in real time.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Backend](https://img.shields.io/badge/backend-FastAPI-009688)
![Frontend](https://img.shields.io/badge/frontend-React-61DAFB)

---

## 📦 Project Structure

```
signalscope/
├── frontend/          # React UI — outage reporting form & map
├── backend/           # FastAPI — REST API, DB models, endpoints
├── infrastructure/    # Cloud configs, Terraform, deployment scripts
├── .github/workflows/ # CI/CD pipelines
├── docker-compose.yml # Local dev orchestration
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- Python 3.11+

### Run Locally

```bash
git clone https://github.com/YOUR_USERNAME/signalscope.git
cd signalscope
docker-compose up --build
```

- Frontend: http://localhost:3000  
- Backend API: http://localhost:8000  
- API Docs: http://localhost:8000/docs

---

## 🛠️ Tech Stack

| Layer          | Technology          |
|----------------|---------------------|
| Frontend       | React, Leaflet.js   |
| Backend        | FastAPI, SQLAlchemy |
| Database       | PostgreSQL          |
| Cache          | Redis               |
| Infrastructure | Docker, Terraform   |
| CI/CD          | GitHub Actions      |

---

## 📄 License

MIT © SignalScope Contributors
