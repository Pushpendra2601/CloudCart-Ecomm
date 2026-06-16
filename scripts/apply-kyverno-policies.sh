#!/usr/bin/env bash
set -euo pipefail

kubectl apply -f security/kyverno/

echo
echo "Kyverno policies applied in Audit mode."
echo
kubectl get clusterpolicy | grep cloudcart || true
echo
echo "Check policy reports with:"
echo "  kubectl get policyreport -A"
echo "  kubectl describe policyreport -n cloudcart"
