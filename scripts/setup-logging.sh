#!/usr/bin/env bash
set -euo pipefail

NAMESPACE="${NAMESPACE:-monitoring}"

helm repo add grafana https://grafana.github.io/helm-charts
helm repo add grafana-community https://grafana-community.github.io/helm-charts
helm repo update

helm upgrade --install loki grafana-community/loki \
  --namespace "$NAMESPACE" \
  --create-namespace \
  -f monitoring/loki-values.yaml

helm upgrade --install promtail grafana/promtail \
  --namespace "$NAMESPACE" \
  --create-namespace \
  -f monitoring/promtail-values.yaml

kubectl wait --for=condition=Ready pod \
  -l app.kubernetes.io/instance=loki \
  -n "$NAMESPACE" \
  --timeout=300s
kubectl rollout status daemonset/promtail -n "$NAMESPACE" --timeout=300s

echo
echo "Loki and Promtail are installed. Open Grafana Explore and select the Loki datasource."
