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

```bash
helm history cloudcart -n cloudcart
./scripts/rollback.sh REVISION
```

## Port Forward

```bash
kubectl port-forward -n cloudcart svc/cloudcart-frontend 8080:80
kubectl port-forward -n monitoring svc/monitoring-grafana 3000:80
kubectl port-forward -n monitoring svc/monitoring-kube-prometheus-prometheus 9090:9090
```

## Common Issues

- `ImagePullBackOff`: check image name, tag, and registry credentials.
- `CrashLoopBackOff`: check application logs and environment variables.
- `Pending`: check PVC binding and node capacity.
- `Readiness probe failed`: check endpoint path, port, and app startup time.
- No Prometheus targets: check `ServiceMonitor` labels and Prometheus selectors.
