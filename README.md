# Backstage workshop: reference repo

The finished state of the two PlatformEngr Learn courses:

- [Backstage: run your developer portal](https://platformengr.com/learn/backstage/)
- [Backstage plugin development](https://platformengr.com/learn/backstage-plugins/)

Learners build their own copy and copy files from here when a module says so.

| Folder | Owner | What it is |
| --- | --- | --- |
| `portal/` | platform team | The Backstage app, created with `@backstage/create-app` and changed module by module. |
| `portal/catalog/` | platform team | Teams, people, domains and systems. |
| `portal/templates/` | platform team | Software templates. |
| `portal/plugins/` | platform team | Custom backend modules and plugins. |
| `checkout/` | team-checkout | What goes in the `checkout` service repo: `catalog-info.yaml`, OpenAPI spec, TechDocs. |
| `docs/` | course | One-page summaries that link to [backstage.io](https://backstage.io/docs). |

`YOUR_GITHUB_USER` is replaced with your GitHub username when you copy a file.

## Versions

| Tool | Version | How it is bumped |
| --- | --- | --- |
| `@backstage/create-app` | 0.9.3 (Backstage 1.56.0) | Pinned in the course; the app is upgraded with `yarn backstage-cli versions:bump`. |
| Backstage release | see `portal/backstage.json` | `yarn backstage-cli versions:bump --release <version>` |
| Node.js | 22 or 24 | `engines` in `portal/package.json` |
| PostgreSQL | 17.11 | Image tag in the course commands. |

## Tags

- `course-1-done`: the portal at the end of the first course. The plugin course starts here.
- `course-2-done`: the portal with the readiness plugins from the plugin course.

## Plugin course: readiness scorecard

A production-readiness scorecard for catalog components. All packages live in `portal/plugins/`.

| Package | Kind | What it does |
| --- | --- | --- |
| `readiness-common` | common | Shared types and the two permissions. |
| `readiness-node` | node library | The `readiness.checks` extension point. |
| `readiness-backend` | backend plugin | REST API, Postgres storage, scheduled evaluation. |
| `readiness-backend-module-api` | backend module | team-checkout's `provides-api` check. |
| `readiness-backend-module-ownership` | backend module | The capstone: `owner-is-team`, using the catalog. |
| `permission-backend-module-acme` | backend module | Our permission policy: only `group:default/platform` may evaluate. |
| `readiness` | frontend plugin | API client, `/readiness` page, entity card and tab. |

Try it: `yarn tsc`, `yarn test --watchAll=false`, then `curl -H "Authorization: Bearer $PORTAL_API_TOKEN" localhost:7007/api/readiness/checks`.

## What is simplified

- One GitHub account stands in for the company organisation; teams are Groups in a YAML file.
- Secrets live in a local `.env` file. Production reads them from a secret store.
- The portal runs as one container with Postgres on your laptop, not on a cluster.
