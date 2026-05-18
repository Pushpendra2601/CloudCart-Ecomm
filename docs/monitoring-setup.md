# CloudCart Monitoring Setup

This guide connects the deployed CloudCart application to Prometheus, Grafana, and Alertmanager.

## 1. Install kube-prometheus-stack

Run from WSL at the project root:

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm upgrade --install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  -f monitoring/prometheus-values.yaml
```

Why this stack is used:

- Prometheus scrapes Kubernetes and application metrics.
- Grafana visualizes cluster and application health.
- Alertmanager handles alert routing.
- kube-state-metrics exposes Kubernetes object state.
- node-exporter exposes node-level CPU, memory, disk, and network metrics.

## 2. Apply CloudCart Alert Rules

```bash
kubectl apply -f monitoring/alert-rules.yaml
```

Verify:

```bash
kubectl get prometheusrule -A
```

## 3. Verify ServiceMonitor

The CloudCart Helm chart creates a ServiceMonitor for the backend API:

```bash
kubectl get servicemonitor -n cloudcart
kubectl describe servicemonitor cloudcart-backend -n cloudcart
```

Expected:

```text
cloudcart-backend
path: /metrics
port: http
interval: 30s
```

## 4. Verify Backend Metrics Endpoint

```bash
kubectl port-forward -n cloudcart svc/cloudcart-backend 8089:8080
```

In another terminal:

```bash
curl http://localhost:8089/metrics
```

You should see metrics like:

```text
cloudcart_up 1
cloudcart_uptime_seconds ...
cloudcart_orders_total ...
http_requests_total ...
```

## 5. Open Prometheus

```bash
kubectl port-forward -n monitoring svc/monitoring-kube-prometheus-prometheus 9090:9090
```

Open:

```text
http://localhost:9090
```

Go to:

```text
Status → Targets
```

Look for:

```text
serviceMonitor/cloudcart/cloudcart-backend
```

Useful PromQL queries:

```promql
cloudcart_up
cloudcart_uptime_seconds
cloudcart_orders_total
sum(rate(http_requests_total[5m]))
kube_deployment_status_replicas_available{namespace="cloudcart"}
kube_pod_container_status_restarts_total{namespace="cloudcart"}
```

## 6. Open Grafana

Get Grafana admin password:

```bash
kubectl get secret -n monitoring monitoring-grafana \
  -o jsonpath="{.data.admin-password}" | base64 -d
```

Port-forward:

```bash
kubectl port-forward -n monitoring svc/monitoring-grafana 3000:80
```

Open:

```text
http://localhost:3000
```

Login:

```text
Username: admin
Password: value from secret
```

## 7. Import CloudCart Dashboard

In Grafana:

```text
Dashboards → New → Import → Upload JSON file
```

Use:

```text
monitoring/grafana-dashboards/cloudcart-dashboard.json
```

Select Prometheus datasource and import.

## 8. Check Alerts

Open Prometheus:

```text
http://localhost:9090/alerts
```

Expected CloudCart alerts:

- `CloudCartPodCrashLooping`
- `CloudCartDeploymentUnavailable`
- `CloudCartHighErrorRate`
- `CloudCartPVCAlmostFull`

## 9. Generate Demo Traffic

Run:

```bash
for i in {1..50}; do curl -s http://localhost:8089/api/products > /dev/null; done
```

Then query:

```promql
sum(rate(http_requests_total[5m]))
```

## 10. Monitoring Troubleshooting

If CloudCart target is missing:

```bash
kubectl get servicemonitor -A
kubectl get svc cloudcart-backend -n cloudcart --show-labels
kubectl describe servicemonitor cloudcart-backend -n cloudcart
kubectl logs -n monitoring statefulset/prometheus-monitoring-kube-prometheus-prometheus
```

If Prometheus cannot scrape `/metrics`:

```bash
kubectl port-forward -n cloudcart svc/cloudcart-backend 8089:8080
curl -v http://localhost:8089/metrics
```

If Grafana has no data:

```bash
kubectl get svc -n monitoring
kubectl get pods -n monitoring
```

Then verify the Grafana datasource points to the Prometheus service.
