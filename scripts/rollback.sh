#!/usr/bin/env bash
set -euo pipefail

RELEASE="${RELEASE:-cloudcart}"
NAMESPACE="${NAMESPACE:-cloudcart}"
REVISION="${1:-}"

helm history "$RELEASE" -n "$NAMESPACE"

if [[ -z "$REVISION" ]]; then
  echo "Usage: ./scripts/rollback.sh <revision>"
  exit 1
fi

helm rollback "$RELEASE" "$REVISION" -n "$NAMESPACE"
kubectl rollout status deployment/cloudcart-backend -n "$NAMESPACE" --timeout=180s
kubectl rollout status deployment/cloudcart-frontend -n "$NAMESPACE" --timeout=180s
