# Architecture of a Backstage app

Full reference: [Architecture overview](https://backstage.io/docs/overview/architecture-overview).

```
browser ──> app (React, packages/app) ──HTTP──> backend (Node, packages/backend)
                                                  ├─ catalog plugin ── database
                                                  ├─ scaffolder plugin
                                                  ├─ techdocs, search, auth, ...
                                                  └─ your plugins and modules
```

| Piece | Where | What it does |
| --- | --- | --- |
| App | `packages/app` | A single-page React app. Plugins add pages, nav items and entity tabs as **extensions**. |
| Backend | `packages/backend` | One Node process that loads backend plugins and modules with `backend.add(...)`. |
| Plugin | `plugins/*` or npm | A feature with its own HTTP API (`/api/<pluginId>`) and its own database schema. |
| Module | `plugins/*-module-*` or npm | Extends one plugin through its extension points, e.g. a catalog provider or a scaffolder action. |
| Config | `app-config*.yaml` | Read by both sides. Keys marked `frontend` in a schema reach the browser; nothing else does. |

Plugins talk to each other over HTTP with service tokens, never by importing
each other's internals. In development the app runs on `:3000` and the backend
on `:7007`; in production the backend serves the built app on one port.
