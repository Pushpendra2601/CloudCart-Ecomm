# CloudCart Runbook

## Deploy

```bash
./scripts/deploy.sh
```

## Check Health

```bash
kubectl get pods -n cloudcart
kubectl rollout status deployment/cloudcart-backend -n cloudcart
kubectl rollout status deployment/cloudcart-frontend -n cloudcart
```

## Debug a Failing Pod

```bash
kubectl describe pod POD_NAME -n cloudcart
kubectl logs POD_NAME -n cloudcart
kubectl get events -n cloudcart --sort-by=.lastTimestamp
```

## Roll Back

### Helm Branch

```bash
helm history cloudcart -n cloudcart
./scripts/rollback.sh REVISION
```

### ArgoCD Branch

Rollback in the GitOps flow is performed by reverting the Git commit that changed the desired image tag.

```bash
git log --oneline -- helm/cloudcart/values-gitops.yaml
./scripts/argocd-rollback.sh COMMIT_ID
```

ArgoCD will sync Kubernetes back to the image tag stored in Git.

## ArgoCD Drift and Self-Heal

Create a manual cluster drift:

```bash
./scripts/argocd-drift-demo.sh
```

If auto-sync is disabled, restore manually:

```bash
argocd app sync cloudcart
argocd app wait cloudcart --health --timeout 300
```

Enable automated sync, self-heal, and prune:

```bash
./scripts/argocd-enable-self-heal.sh
```

After self-heal is enabled, repeat the drift demo. ArgoCD should restore the live deployment back to the desired state from Git.

## Port Forward

```bash
kubectl port-forward -n cloudcart svc/cloudcart-frontend 8080:80
kubectl port-forward -n monitoring svc/monitoring-grafana 3000:80
kubectl port-forward -n monitoring svc/monitoring-kube-prometheus-prometheus 9090:9090
kubectl port-forward -n monitoring svc/loki-gateway 3100:80
```

## Common Issues

- `ImagePullBackOff`: check image name, tag, and registry credentials.
- `CrashLoopBackOff`: check application logs and environment variables.
- `Pending`: check PVC binding and node capacity.
- `Readiness probe failed`: check endpoint path, port, and app startup time.
- No Prometheus targets: check `ServiceMonitor` labels and Prometheus selectors.
