# Trivy Policy

The Jenkins pipeline fails when either application image contains HIGH or CRITICAL vulnerabilities.

Default command:

```bash
trivy image --severity HIGH,CRITICAL --exit-code 1 ghcr.io/YOUR_USER/cloudcart-backend:TAG
```

Recommended production additions:

- Generate SBOMs with `trivy image --format cyclonedx`.
- Store scan reports as Jenkins build artifacts.
- Allow exceptions only with owner, expiry date, CVE, and business justification.
- Sign approved images with Cosign.
- Block unsigned images with Kyverno or OPA Gatekeeper.
