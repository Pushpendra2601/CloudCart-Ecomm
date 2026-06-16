# CloudCart Resume and Interview Notes

## Resume Summary

Built a production-grade Kubernetes DevOps platform for a CloudCart e-commerce application using Docker, Jenkins CI, Helm, ArgoCD GitOps, Prometheus, Grafana, Alertmanager, Loki, Promtail, Ingress NGINX, HPA, ConfigMaps, Secrets, RBAC, NetworkPolicies, PostgreSQL persistent storage, Redis caching, Trivy image scanning, drift detection, rollback, and operational runbooks.

## ATS Keywords

Kubernetes, Docker, Jenkins, CI/CD, Helm, Prometheus, Grafana, Alertmanager, Loki, Promtail, Ingress, HPA, RBAC, NetworkPolicy, ConfigMap, Secret, PostgreSQL, Redis, Trivy, GitHub Webhooks, DevOps, GitOps, ArgoCD, Kyverno.

## Interview Questions

- How is responsibility split between Jenkins and ArgoCD?
- Why use Helm instead of only raw manifests?
- How do liveness and readiness probes differ?
- How does HPA know when to scale?
- How do you roll back in the Helm branch versus the ArgoCD branch?
- How do NetworkPolicies improve security?
- Why should production deployments avoid the `latest` tag?
- How does Prometheus discover CloudCart metrics?
- How do Loki and Promtail provide centralized logging?
- What does ArgoCD drift detection mean?
- Where would Kyverno fit in this platform?
- What would change when moving this to EKS, AKS, or GKE?

## Real-World Scenarios

- Deployment fails after image push on the Helm branch: use `helm history`, `helm rollback`, and pod events.
- Deployment fails after image promotion on the ArgoCD branch: inspect ArgoCD sync status, pod events, and revert the GitOps image tag commit if needed.
- API latency spikes: check Grafana, CPU throttling, pod restarts, and backend metrics.
- API error is unclear from metrics: use Grafana Explore with Loki and LogQL to inspect backend pod logs.
- Database storage grows: check PVC usage alert and run backup or expansion procedure.
- Jenkins cannot push image tag update: check GitHub credentials, repository permissions, and `values-gitops.yaml`.
- Ingress returns 404: check ingress class, host header, path rules, and backend service ports.
