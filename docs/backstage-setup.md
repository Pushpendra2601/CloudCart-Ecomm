# CloudCart Backstage Setup

Backstage turns CloudCart into a discoverable platform service. The Software Catalog shows ownership, lifecycle, dependencies, repository links, ArgoCD links, Grafana links, and TechDocs.

## What Was Added

CloudCart includes:

```text
catalog-info.yaml
mkdocs.yml
```

`catalog-info.yaml` registers:

- `System`: `cloudcart-platform`
- `Component`: `cloudcart`
- `Resource`: `cloudcart-postgres`
- `Resource`: `cloudcart-redis`
- `Group`: `platform-team`
- `Domain`: `ecommerce`

`mkdocs.yml` enables TechDocs to render the project documentation in Backstage.

## Create A Local Backstage App

Run outside the CloudCart repo:

```bash
npx @backstage/create-app@latest
```

Example app name:

```text
cloudcart-backstage
```

Start Backstage:

```bash
cd cloudcart-backstage
yarn dev
```

Open:

```text
http://localhost:3000
```

## Register CloudCart In The Catalog

In Backstage:

```text
Create -> Register Existing Component
```

Use the raw GitHub URL to `catalog-info.yaml`:

```text
https://github.com/Pushpendra2601/CloudCart-Ecomm/blob/argocd/catalog-info.yaml
```

If Backstage expects a raw file URL, use:

```text
https://raw.githubusercontent.com/Pushpendra2601/CloudCart-Ecomm/argocd/catalog-info.yaml
```

After registration, Backstage should show:

- CloudCart component
- Platform system
- PostgreSQL and Redis dependencies
- GitHub repository link
- ArgoCD application link
- Grafana dashboard link
- TechDocs navigation

## TechDocs Requirements

TechDocs uses `mkdocs.yml`.

For local TechDocs generation, install:

```bash
pip install mkdocs-techdocs-core
```

Backstage will use:

```yaml
backstage.io/techdocs-ref: dir:.
```

from `catalog-info.yaml`.

## Platform Engineering Value

Backstage adds the developer portal layer:

- Service discovery
- Ownership metadata
- Operational links
- Architecture documentation
- Runbooks
- Observability links
- GitOps links
- Dependency visibility

With this, CloudCart is not only deployed and monitored; it is also discoverable as a platform service.
