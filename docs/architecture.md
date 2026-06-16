# CloudCart Architecture

CloudCart is a production-oriented Kubernetes project built around a small e-commerce workload.

## Runtime Components

- Frontend: Nginx static site that proxies `/api` requests to the backend service.
- Backend: Node.js HTTP API exposing health, readiness, products, orders, and Prometheus metrics.
- PostgreSQL: StatefulSet with a persistent volume claim.
- Redis: Cache layer deployed as an internal ClusterIP service.
- Ingress NGINX: External HTTP routing.
- Prometheus and Grafana: Metrics collection, alerting, and visualization.
- Loki and Promtail: Centralized Kubernetes pod log collection and querying.
- Jenkins: CI automation, image scanning, image publishing, and GitOps image promotion.
- ArgoCD: GitOps controller that syncs the Helm chart from Git to Kubernetes.

## Deployment Flows

### Helm Branch

1. Developer pushes code to GitHub.
2. Jenkins runs tests and builds Docker images.
3. Trivy scans images for HIGH and CRITICAL vulnerabilities.
4. Jenkins pushes immutable image tags.
5. Jenkins deploys the Helm chart directly to Kubernetes.
6. Kubernetes performs rolling updates and Jenkins verifies rollout status.

### ArgoCD Branch

1. Developer pushes code to GitHub.
2. Jenkins runs tests and builds Docker images.
3. Trivy scans images for HIGH and CRITICAL vulnerabilities.
4. Jenkins pushes immutable image tags to GitHub Container Registry.
5. Jenkins updates `helm/cloudcart/values-gitops.yaml` with the new image tag.
6. Jenkins commits and pushes the GitOps change to GitHub.
7. ArgoCD detects the desired state change in Git.
8. ArgoCD renders the Helm chart and syncs Kubernetes.
9. Drift is corrected by ArgoCD sync or automated self-heal.

## Observability Flow

- Prometheus scrapes backend metrics through the CloudCart ServiceMonitor.
- Grafana visualizes application metrics, Kubernetes health, and alerts.
- Promtail collects pod logs from Kubernetes nodes.
- Loki stores and indexes log streams.
- Grafana Explore queries Loki using LogQL.

## Production Controls

- Resource requests and limits prevent noisy-neighbor behavior.
- Readiness probes protect traffic routing during startup.
- Liveness probes restart unhealthy containers.
- PodDisruptionBudgets reduce voluntary disruption risk.
- HPA scales backend replicas using CPU utilization.
- NetworkPolicies limit service-to-service communication.
- RBAC limits service account access.
- Kyverno policies are planned to enforce platform guardrails at admission time.
