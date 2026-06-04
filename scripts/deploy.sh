#!/usr/bin/env bash
set -euo pipefail

RELEASE="${RELEASE:-cloudcart}"
NAMESPACE="${NAMESPACE:-cloudcart}"
CHART="${CHART:-helm/cloudcart}"

helm upgrade --install "$RELEASE" "$CHART" \
  --namespace "$NAMESPACE" \
  --create-namespace \
  --atomic \
  --timeout 5m

kubectl rollout status deployment/cloudcart-backend -n "$NAMESPACE" --timeout=180s
kubectl rollout status deployment/cloudcart-frontend -n "$NAMESPACE" --timeout=180s
