# CloudCart DevOps Platform
![Jenkins](https://img.shields.io/badge/CI%2FCD-Jenkins-D24939?style=flat&logo=jenkins&logoColor=white)
![Helm](https://img.shields.io/badge/Deploy-Helm-0F1689?style=flat&logo=helm&logoColor=white)
![ArgoCD](https://img.shields.io/badge/GitOps-ArgoCD-EF7B4D?style=flat&logo=argo&logoColor=white)
![Docker](https://img.shields.io/badge/Container-Docker-2496ED?style=flat&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Orchestration-Kubernetes-326CE5?style=flat&logo=kubernetes&logoColor=white)
![GHCR](https://img.shields.io/badge/Registry-GHCR-181717?style=flat&logo=github&logoColor=white)
![Trivy](https://img.shields.io/badge/Security-Trivy-1904DA?style=flat&logo=aquasecurity&logoColor=white)
![Kyverno](https://img.shields.io/badge/Policy-Kyverno-326CE5?style=flat&logo=kubernetes&logoColor=white)
![Prometheus](https://img.shields.io/badge/Metrics-Prometheus-E6522C?style=flat&logo=prometheus&logoColor=white)
![Grafana](https://img.shields.io/badge/Dashboard-Grafana-F46800?style=flat&logo=grafana&logoColor=white)
![Loki](https://img.shields.io/badge/Logs-Loki-F5A623?style=flat&logo=grafana&logoColor=white)
![Promtail](https://img.shields.io/badge/Collector-Promtail-F46800?style=flat&logo=grafana&logoColor=white)
![Backstage](https://img.shields.io/badge/Portal-Backstage-9BF0E1?style=flat&logo=backstage&logoColor=black)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=flat&logo=react&logoColor=black)
![NodeJS](https://img.shields.io/badge/Backend-Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Cache-Redis-DC382D?style=flat&logo=redis&logoColor=white)


Production-oriented DevOps and Kubernetes learning project for deploying a small e-commerce workload end to end.

This repository is organized branch-wise to show two deployment approaches:

| Branch | Purpose | Deployment Model |
|--------|---------|------------------|
| `helm` | Kubernetes deployment using Helm from Jenkins | Jenkins builds, scans, pushes images, and deploys the Helm chart directly |
| `argocd` | GitOps deployment using ArgoCD | Jenkins builds, scans, pushes images, updates Git, and ArgoCD deploys from Git |

CloudCart includes:

- Containerized frontend and backend applications
- Kubernetes deployment with Helm
- GitOps deployment with ArgoCD on the `argocd` branch
- PostgreSQL StatefulSet with persistent storage
- Redis cache
- Ingress, HPA, PDB, RBAC, ConfigMaps, Secrets, and NetworkPolicies
- Jenkins pipeline for CI, image scanning, image publishing, and deployment promotion
- Prometheus, Grafana, Alertmanager, Loki, Promtail, application metrics, and pod logs
- Trivy image scanning and operational runbooks
- Kyverno policy enforcement for admission-time platform guardrails
- Backstage catalog metadata and TechDocs setup
- Backup, rollback, and troubleshooting scripts

## Architecture Options

### Helm Branch

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

### ArgoCD Branch

```mermaid
flowchart LR
  Dev["Developer"] --> GitHub["GitHub"]
  GitHub --> Jenkins["Jenkins"]
  Jenkins --> Test["Backend Tests"]
  Test --> Build["Docker Build"]
  Build --> Scan["Trivy Scan"]
  Scan --> Registry["GitHub Container Registry"]
  Jenkins --> GitOps["Update values-gitops.yaml"]
  GitOps --> GitHub
  GitHub --> ArgoCD["ArgoCD"]
  ArgoCD --> Helm["Render Helm Chart"]
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

Choose the branch based on the deployment model you want to run.

For Helm-based Kubernetes deployment:

```bash
git checkout helm
```

For ArgoCD-based GitOps deployment:

```bash
git checkout argocd
```

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

4. Deploy with Helm on the `helm` branch:

   ```bash
   helm upgrade --install cloudcart helm/cloudcart \
     --namespace cloudcart \
     --create-namespace \
     --set backend.image.repository=cloudcart-backend \
     --set backend.image.tag=local \
     --set frontend.image.repository=cloudcart-frontend \
     --set frontend.image.tag=local
   ```

5. Deploy with ArgoCD on the `argocd` branch:

   ```bash
   argocd app create cloudcart \
     --repo https://github.com/Pushpendra2601/CloudCart-Ecomm.git \
     --revision argocd \
     --path helm/cloudcart \
     --dest-server https://kubernetes.default.svc \
     --dest-namespace cloudcart \
     --values values.yaml \
     --values values-gitops.yaml \
     --sync-option CreateNamespace=true
   ```

   ```bash
   argocd app sync cloudcart
   argocd app wait cloudcart --health --timeout 300
   ```

6. Verify:

   ```bash
   kubectl get pods -n cloudcart
   kubectl get ingress -n cloudcart
   ```

## CI/CD and GitOps Flow

The project demonstrates two delivery patterns.

On the `helm` branch:

1. Jenkins checks out the repository.
2. Jenkins runs backend tests.
3. Jenkins builds backend and frontend Docker images.
4. Jenkins scans images with Trivy.
5. Jenkins pushes immutable tags to GitHub Container Registry.
6. Jenkins deploys the Helm chart directly to Kubernetes.
7. Jenkins verifies rollout status.

On the `argocd` branch:

1. Jenkins checks out the repository.
2. Jenkins runs backend tests.
3. Jenkins builds backend and frontend Docker images.
4. Jenkins scans images with Trivy.
5. Jenkins pushes immutable tags to GitHub Container Registry.
6. Jenkins updates `helm/cloudcart/values-gitops.yaml` with the new image tag.
7. Jenkins commits and pushes the GitOps change.
8. ArgoCD detects the Git change and syncs Kubernetes.

## Main Endpoints

- `GET /healthz`: liveness probe
- `GET /readyz`: readiness probe
- `GET /metrics`: Prometheus metrics
- `GET /api/products`: product catalog
- `POST /api/orders`: create an order

## Recommended Repository Flow

- `helm`: Helm-based Kubernetes deployment flow
- `argocd`: GitOps deployment flow with ArgoCD
- Jenkins builds immutable image tags as `BUILD_NUMBER-GIT_SHORT_SHA`
- Helm branch deploys directly with Helm
- ArgoCD branch deploys by updating Git and letting ArgoCD reconcile Kubernetes state
- Rollback in the Helm flow is handled through Helm release history
- Rollback in the GitOps flow is handled through Git revert or ArgoCD sync history.

## Documentation

- [Architecture](docs/architecture.md)
- [Runbook](docs/runbook.md)
- [Jenkins Setup](docs/jenkins-setup.md)
- [Monitoring Setup](docs/monitoring-setup.md)
- [Logging Setup](docs/logging-setup.md)
- [Kyverno Policy Enforcement](docs/kyverno-policy-plan.md)
- [Backstage Setup](docs/backstage-setup.md)
- [Interview Notes](docs/interview-notes.md)
- [Trivy Policy](security/trivy-policy.md)
