# CloudCart Platform

CloudCart is a production-oriented DevOps and platform engineering project for a small e-commerce workload.

It demonstrates:

- Jenkins CI and image promotion.
- GitHub Container Registry image publishing.
- Helm chart packaging.
- ArgoCD GitOps deployment.
- Kubernetes runtime controls.
- Prometheus and Grafana metrics.
- Loki and Promtail centralized logs.
- Trivy image scanning.
- Kyverno admission policy enforcement.
- Backstage Software Catalog and TechDocs metadata.

## Delivery Flow

```text
Developer push
Jenkins test/build/scan/push
Jenkins updates values-gitops.yaml
ArgoCD syncs Helm chart
Kubernetes runs CloudCart
Prometheus/Grafana/Loki observe the platform
Kyverno enforces admission policies
```

## Main Links

- [Architecture](architecture.md)
- [Runbook](runbook.md)
- [Monitoring Setup](monitoring-setup.md)
- [Logging Setup](logging-setup.md)
- [Kyverno Policy Enforcement](kyverno-policy-plan.md)
- [Backstage Setup](backstage-setup.md)
