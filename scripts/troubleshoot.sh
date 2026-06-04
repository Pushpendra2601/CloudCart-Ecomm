#!/usr/bin/env bash
set -euo pipefail

NAMESPACE="${NAMESPACE:-cloudcart}"

kubectl get all -n "$NAMESPACE"
kubectl get ingress -n "$NAMESPACE"
kubectl get hpa -n "$NAMESPACE"
kubectl get pvc -n "$NAMESPACE"
kubectl get events -n "$NAMESPACE" --sort-by=.lastTimestamp
