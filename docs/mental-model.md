# How to think about Backstage

A summary for people who have clicked around a portal. Each section links to the
official docs for the detail.

## A framework, not a product

You do not install Backstage, you **build an app with it**. `@backstage/create-app`
generates a TypeScript monorepo that your platform team owns, upgrades and ships
like any other service. Plugins are npm packages you add to that app.
[What is Backstage?](https://backstage.io/docs/overview/what-is-backstage)

## The main parts

| Part | What it is | Docs |
| --- | --- | --- |
| Software Catalog | A database of entities (components, APIs, teams) read from YAML in Git. Everything else hangs off it. | [Catalog](https://backstage.io/docs/features/software-catalog/) |
| Software Templates | Forms that run steps on the backend: render files, create a repo, register it. | [Templates](https://backstage.io/docs/features/software-templates/) |
| TechDocs | Markdown next to the code, built with MkDocs and shown on the entity page. | [TechDocs](https://backstage.io/docs/features/techdocs/) |
| Search | One index over the catalog, docs and anything a plugin adds. | [Search](https://backstage.io/docs/features/search/) |
| Plugins | Frontend and backend packages that add pages, cards, APIs and actions. | [Plugins](https://backstage.io/docs/plugins/) |
| Auth and permissions | Sign-in providers map a person to a User entity; policies decide what they may do. | [Auth](https://backstage.io/docs/auth/), [Permissions](https://backstage.io/docs/permissions/overview) |

## Four rules of thumb

1. **The catalog is the product.** A portal with a wrong catalog is worse than no
   portal. Owners, systems and relations must be true.
2. **Git is the source.** Teams describe their software in `catalog-info.yaml` in
   their repo. The portal reads; it does not own the data.
3. **Config, not code, where possible.** Most behaviour (locations, providers,
   which page sits where) is `app-config.yaml`. Code is for what config cannot do.
4. **Keep up with releases.** Backstage ships monthly. Upgrade little and often
   with `yarn backstage-cli versions:bump`.
   [Keeping Backstage updated](https://backstage.io/docs/getting-started/keeping-backstage-updated)
