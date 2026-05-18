# CloudCart Resume and Interview Notes

## Resume Summary

Built a production-grade Kubernetes DevOps platform for a CloudCart e-commerce application using Docker, Jenkins CI/CD, Helm, Prometheus, Grafana, Alertmanager, Ingress NGINX, HPA, ConfigMaps, Secrets, RBAC, NetworkPolicies, PostgreSQL persistent storage, Redis caching, Trivy image scanning, automated rollback, and GitOps-ready deployment practices.

## ATS Keywords

Kubernetes, Docker, Jenkins, CI/CD, Helm, Prometheus, Grafana, Alertmanager, Ingress, HPA, RBAC, NetworkPolicy, ConfigMap, Secret, PostgreSQL, Redis, Trivy, GitHub Webhooks, DevOps, GitOps, ArgoCD.

## Interview Questions

- How does Jenkins deploy CloudCart to Kubernetes?
- Why use Helm instead of only raw manifests?
- How do liveness and readiness probes differ?
- How does HPA know when to scale?
- How do you roll back a failed Helm deployment?
- How do NetworkPolicies improve security?
- Why should production deployments avoid the `latest` tag?
- How does Prometheus discover CloudCart metrics?
- What would change when moving this to EKS, AKS, or GKE?

## Real-World Scenarios

- Deployment fails after image push: use `helm history`, `helm rollback`, and pod events.
- API latency spikes: check Grafana, CPU throttling, pod restarts, and backend metrics.
- Database storage grows: check PVC usage alert and run backup or expansion procedure.
- Jenkins cannot deploy: check service account permissions and kubeconfig credentials.
- Ingress returns 404: check ingress class, host header, path rules, and backend service ports.
