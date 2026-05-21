# CloudCart DevOps Platform
![Jenkins](https://img.shields.io/badge/CI%2FCD-Jenkins-D24939?style=flat&logo=jenkins&logoColor=white)
![Helm](https://img.shields.io/badge/Deploy-Helm-0F1689?style=flat&logo=helm&logoColor=white)
![Docker](https://img.shields.io/badge/Container-Docker-2496ED?style=flat&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Orchestration-Kubernetes-326CE5?style=flat&logo=kubernetes&logoColor=white)
![GHCR](https://img.shields.io/badge/Registry-GHCR-181717?style=flat&logo=github&logoColor=white)
![Trivy](https://img.shields.io/badge/Security-Trivy-1904DA?style=flat&logo=aquasecurity&logoColor=white)
![Prometheus](https://img.shields.io/badge/Metrics-Prometheus-E6522C?style=flat&logo=prometheus&logoColor=white)
![Grafana](https://img.shields.io/badge/Dashboard-Grafana-F46800?style=flat&logo=grafana&logoColor=white)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=flat&logo=react&logoColor=black)
![NodeJS](https://img.shields.io/badge/Backend-Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Cache-Redis-DC382D?style=flat&logo=redis&logoColor=white)
![Jenkins](...)  ![Helm](...)  ![Docker](...)  ![Kubernetes](...)
![GHCR](...)  ![Trivy](...)
![Prometheus](...)  ![Grafana](...)
![React](...)  ![NodeJS](...)  ![PostgreSQL](...)  ![Redis](...)

Production-oriented DevOps and Kubernetes learning project for deploying a small e-commerce workload end to end.

CloudCart includes:

- Containerized frontend and backend applications
- Kubernetes deployment with Helm
- PostgreSQL StatefulSet with persistent storage
- Redis cache
- Ingress, HPA, PDB, RBAC, ConfigMaps, Secrets, and NetworkPolicies
- Jenkins CI/CD pipeline
- Prometheus, Grafana, Alertmanager, and application metrics
- Trivy image scanning and operational runbooks
- Backup, rollback, and troubleshooting scripts

## Architecture

```mermaid
flowchart LR
  Dev["Developer"] --> GitHub["GitHub"]
  GitHub --> Jenkins["Jenkins"]
  Jenkins --> Scan["Tests + Trivy"]
  Scan --> Registry["Container Registry"]
  Jenkins --> Helm["Helm Upgrade"]
  Helm --> K8s["Kubernetes"]
  User["User"] --> Ingress["Ingress NGINX"]
  Ingress --> Frontend["Frontend"]
  Ingress --> Backend["Backend API"]
  Backend --> Postgres["PostgreSQL PVC"]
  Backend --> Redis["Redis"]
  Prometheus["Prometheus"] --> Backend
  Grafana["Grafana"] --> Prometheus
```

## Quick Start

1. Build and test locally:

   ```bash
   cd app/backend
   npm test
   npm start
   ```

2. Build images:

   ```bash
   docker build -t cloudcart-backend:local app/backend
   docker build -t cloudcart-frontend:local app/frontend
   ```

3. Run the redesigned frontend with Docker:

   ```bash
   docker network create cloudcart-network
   docker run -d --name cloudcart-backend --network cloudcart-network cloudcart-backend:local
   docker run -d --name cloudcart-frontend --network cloudcart-network -p 8080:80 cloudcart-frontend:local
   ```

   Open:

   ```text
   http://localhost:8080
   ```

4. Deploy with Helm:

   ```bash
   helm upgrade --install cloudcart helm/cloudcart \
     --namespace cloudcart \
     --create-namespace \
     --set backend.image.repository=cloudcart-backend \
     --set backend.image.tag=local \
     --set frontend.image.repository=cloudcart-frontend \
     --set frontend.image.tag=local
   ```

5. Verify:

   ```bash
   kubectl get pods -n cloudcart
   kubectl get ingress -n cloudcart
   ```

## Main Endpoints

- `GET /healthz`: liveness probe
- `GET /readyz`: readiness probe
- `GET /metrics`: Prometheus metrics
- `GET /api/products`: product catalog
- `POST /api/orders`: create an order

## Recommended Repository Flow

- `main`: production-ready code
- `develop`: integration branch
- `feature/*`: feature work
- Jenkins builds immutable image tags as `BUILD_NUMBER-GIT_SHORT_SHA`
- Helm performs atomic upgrades and rollback on failure

## Documentation

- [Architecture](docs/architecture.md)
- [Runbook](docs/runbook.md)
- [Jenkins Setup](docs/jenkins-setup.md)
- [Interview Notes](docs/interview-notes.md)
- [Trivy Policy](security/trivy-policy.md)
