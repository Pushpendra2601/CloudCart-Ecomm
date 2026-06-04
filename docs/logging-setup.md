# CloudCart Logging Setup

This guide adds centralized Kubernetes log collection to CloudCart using Promtail, Loki, and Grafana.

Promtail runs as a DaemonSet, reads container logs from Kubernetes nodes, attaches Kubernetes labels such as namespace, pod, and container, and sends those logs to Loki. Grafana queries Loki through the Loki datasource.

Note: Promtail is deprecated and reached end-of-life on March 2, 2026. It is still included here because this branch demonstrates the classic Loki logging stack used in many DevOps setups. For newer production designs, Grafana Alloy is the recommended replacement collector.

## 1. Install Loki and Promtail

Run from WSL at the project root:

```bash
chmod +x scripts/setup-logging.sh
./scripts/setup-logging.sh
```

This installs:

- Loki in monolithic mode for log storage.
- MinIO as the local object store used by Loki.
- Promtail as a DaemonSet to collect pod logs from every Kubernetes node.

## 2. Restart Grafana Datasource Provisioning

The kube-prometheus-stack values file provisions Loki as an additional Grafana datasource.

Upgrade the monitoring stack after adding the datasource:

```bash
helm upgrade --install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  -f monitoring/prometheus-values.yaml
```

Then restart Grafana if needed:

```bash
kubectl rollout restart deployment/monitoring-grafana -n monitoring
kubectl rollout status deployment/monitoring-grafana -n monitoring --timeout=180s
```

## 3. Open Grafana

```bash
kubectl port-forward -n monitoring svc/monitoring-grafana 3000:80
```

Open:

```text
http://localhost:3000
```

Go to:

```text
Explore -> Loki
```

## 4. Useful LogQL Queries

All CloudCart logs:

```logql
{namespace="cloudcart"}
```

Backend logs:

```logql
{namespace="cloudcart", pod=~"cloudcart-backend.*"}
```

Frontend logs:

```logql
{namespace="cloudcart", pod=~"cloudcart-frontend.*"}
```

Logs containing order activity:

```logql
{namespace="cloudcart", pod=~"cloudcart-backend.*"} |= "order"
```

Error-looking log lines:

```logql
{namespace="cloudcart"} |~ "(?i)error|exception|failed"
```

## 5. Generate Logs

Port-forward the backend:

```bash
kubectl port-forward -n cloudcart svc/cloudcart-backend 8089:8080
```

Generate API traffic:

```bash
for i in {1..25}; do curl -s http://localhost:8089/api/products > /dev/null; done
```

Create an order:

```bash
curl -s -X POST http://localhost:8089/api/orders \
  -H "Content-Type: application/json" \
  -d '{"items":[{"id":"sku-1001","quantity":1}],"total":29.99}'
```

Then search in Grafana Explore:

```logql
{namespace="cloudcart", pod=~"cloudcart-backend.*"}
```

## 6. Troubleshooting

Check Loki:

```bash
kubectl get pods -n monitoring | grep loki
kubectl logs -n monitoring -l app.kubernetes.io/instance=loki --tail=100
```

Check Promtail:

```bash
kubectl get pods -n monitoring | grep promtail
kubectl logs -n monitoring daemonset/promtail
```

Check Loki labels directly:

```bash
kubectl port-forward -n monitoring svc/loki-gateway 3100:80
curl "http://localhost:3100/loki/api/v1/labels"
```
