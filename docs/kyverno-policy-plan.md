# CloudCart Kyverno Policy Plan

Kyverno is a Kubernetes policy engine. It runs inside the cluster and works with the Kubernetes admission controller. When a user, Jenkins, Helm, or ArgoCD tries to create or update a resource, Kyverno can validate, mutate, generate, or report on that resource before it is accepted by the API server.

For CloudCart, Kyverno will be used as a platform guardrail layer.

## Why It Belongs In This Project

CloudCart already has CI, GitOps, observability, and Kubernetes deployment automation. Kyverno adds admission-time governance:

- Jenkins and ArgoCD can deploy only workloads that meet platform rules.
- Mistakes are blocked before they become running pods.
- Security and reliability standards become code.
- Policy violations can be reported and audited.

## Initial Policies

### 1. Disallow `latest` Image Tags

Purpose:

- Prevent untraceable deployments.
- Enforce immutable image tags such as `BUILD_NUMBER-GIT_SHORT_SHA`.

Expected behavior:

- `ghcr.io/pushpendra2601/cloudcart-backend:28-abc1234` is allowed.
- `ghcr.io/pushpendra2601/cloudcart-backend:latest` is blocked.

### 2. Require CPU and Memory Requests/Limits

Purpose:

- Prevent workloads from running without resource boundaries.
- Support stable scheduling and HPA behavior.

Expected behavior:

- Pods without `resources.requests` or `resources.limits` are blocked.

### 3. Require Non-Root Containers

Purpose:

- Enforce a safer container runtime posture.
- Reduce impact if an application container is compromised.

Expected behavior:

- Containers must set `securityContext.runAsNonRoot: true`.

### 4. Restrict Image Registry

Purpose:

- Allow only trusted images from GitHub Container Registry for CloudCart workloads.

Expected behavior:

- `ghcr.io/pushpendra2601/*` is allowed.
- Public random images are blocked in the CloudCart namespace.

## Suggested Rollout Approach

Start with audit mode:

```yaml
validationFailureAction: Audit
```

Then move to enforce mode after existing workloads pass:

```yaml
validationFailureAction: Enforce
```

This avoids breaking the cluster during the first policy installation.

## Install Kyverno

Kyverno should be installed in its own namespace:

```bash
helm repo add kyverno https://kyverno.github.io/kyverno/
helm repo update
helm install kyverno kyverno/kyverno -n kyverno --create-namespace
```

For production, Kyverno supports high availability by increasing controller replicas. For this local CloudCart environment, the default non-production Helm install is enough.

## Verification Commands

```bash
kubectl get pods -n kyverno
kubectl get clusterpolicy
kubectl get policyreport -A
```

After policies are installed, test them with a bad deployment manifest that uses `:latest` or omits resource limits. The API server should reject it when policies are in enforce mode.
