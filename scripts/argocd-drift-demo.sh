#!/usr/bin/env bash
set -euo pipefail

APP="${APP:-cloudcart}"
NAMESPACE="${NAMESPACE:-cloudcart}"
DEPLOYMENT="${DEPLOYMENT:-cloudcart-backend}"
DRIFT_REPLICAS="${DRIFT_REPLICAS:-1}"

echo "Current ArgoCD application state:"
argocd app get "$APP"

echo
echo "Creating drift by scaling $DEPLOYMENT to $DRIFT_REPLICAS replica(s)..."
kubectl scale deployment "$DEPLOYMENT" -n "$NAMESPACE" --replicas="$DRIFT_REPLICAS"

echo
echo "Live deployment state after manual change:"
kubectl get deployment "$DEPLOYMENT" -n "$NAMESPACE"

echo
echo "Refreshing ArgoCD comparison..."
argocd app get "$APP" --refresh

echo
echo "If auto-sync/self-heal is disabled, restore with:"
echo "  argocd app sync $APP"
echo
echo "If self-heal is enabled, wait and then run:"
echo "  kubectl get deployment $DEPLOYMENT -n $NAMESPACE"
