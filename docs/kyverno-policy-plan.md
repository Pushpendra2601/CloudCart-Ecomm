# CloudCart Kyverno Policy Enforcement

Kyverno is a Kubernetes policy engine. It runs inside the cluster and works with the Kubernetes admission controller. When a user, Jenkins, Helm, or ArgoCD tries to create or update a resource, Kyverno can validate, mutate, generate, or report on that resource before it is accepted by the API server.

For CloudCart, Kyverno is used as a platform guardrail layer.

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

## Rollout Approach Used

The policies were first introduced in audit mode:

```yaml
validationFailureAction: Audit
```

After the Helm chart was hardened and policy reports showed current CloudCart workloads passing, the policies were moved to enforce mode:

```yaml
validationFailureAction: Enforce
```

This avoided breaking ArgoCD sync during the first policy installation and then moved the cluster into active admission enforcement.

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

## Apply CloudCart Policies

The policies are stored in:

```text
security/kyverno/
```

Apply them:

```bash
chmod +x scripts/apply-kyverno-policies.sh
./scripts/apply-kyverno-policies.sh
```

The current repository version runs in `Enforce` mode. If the policies are being introduced into a fresh cluster, switch them to `Audit` first, review policy reports, harden workloads, and then move them back to `Enforce`.

## Check Reports

```bash
kubectl get clusterpolicy
kubectl get policyreport -A
kubectl describe policyreport -n cloudcart
```

## Test A Bad Pod

Apply the intentionally bad test pod:

```bash
kubectl apply -f security/kyverno/test-bad-latest-pod.yaml
```

In enforce mode, Kyverno should reject the pod because it violates the image tag, registry, and non-root guardrails.

Clean up:

```bash
kubectl delete -f security/kyverno/test-bad-latest-pod.yaml --ignore-not-found
```
