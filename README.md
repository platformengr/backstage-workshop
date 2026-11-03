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

## What is simplified

- One GitHub account stands in for the company organisation; teams are Groups in a YAML file.
- Secrets live in a local `.env` file. Production reads them from a secret store.
- The portal runs as one container with Postgres on your laptop, not on a cluster.
