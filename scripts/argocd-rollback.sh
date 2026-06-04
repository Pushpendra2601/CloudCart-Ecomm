#!/usr/bin/env bash
set -euo pipefail

APP="${APP:-cloudcart}"
COMMIT="${1:-}"

if [[ -z "$COMMIT" ]]; then
  echo "Usage: ./scripts/argocd-rollback.sh <git-commit-to-revert>"
  echo
  echo "Find recent GitOps image tag commits with:"
  echo "  git log --oneline -- helm/cloudcart/values-gitops.yaml"
  exit 1
fi

git revert "$COMMIT"
git push

echo
echo "Git revert pushed. Syncing ArgoCD application..."
argocd app sync "$APP"
argocd app wait "$APP" --health --timeout 300

echo
echo "Rollback through GitOps completed."
