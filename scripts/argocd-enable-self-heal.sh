#!/usr/bin/env bash
set -euo pipefail

APP="${APP:-cloudcart}"

argocd app set "$APP" --sync-policy automated --self-heal --auto-prune

echo
echo "ArgoCD automated sync, self-heal, and prune are enabled for $APP."
argocd app get "$APP"
