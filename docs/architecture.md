# CloudCart Architecture

CloudCart is a production-oriented Kubernetes project built around a small e-commerce workload.

## Runtime Components

- Frontend: Nginx static site that proxies `/api` requests to the backend service.
- Backend: Node.js HTTP API exposing health, readiness, products, orders, and Prometheus metrics.
- PostgreSQL: StatefulSet with a persistent volume claim.
- Redis: Cache layer deployed as an internal ClusterIP service.
- Ingress NGINX: External HTTP routing.
- Prometheus and Grafana: Metrics collection, alerting, and visualization.
- Jenkins: CI/CD automation.

## Deployment Flow

1. Developer pushes code to GitHub.
2. Jenkins runs tests and builds Docker images.
3. Trivy scans images for HIGH and CRITICAL vulnerabilities.
4. Jenkins pushes immutable image tags.
5. Jenkins deploys the Helm chart with `helm upgrade --install --atomic`.
6. Kubernetes performs rolling updates and Jenkins verifies rollout status.

## Production Controls

- Resource requests and limits prevent noisy-neighbor behavior.
- Readiness probes protect traffic routing during startup.
- Liveness probes restart unhealthy containers.
- PodDisruptionBudgets reduce voluntary disruption risk.
- HPA scales backend replicas using CPU utilization.
- NetworkPolicies limit service-to-service communication.
- RBAC limits service account access.
