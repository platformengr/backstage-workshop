# The catalog model in one page

Full reference: [System model](https://backstage.io/docs/features/software-catalog/system-model)
and [Descriptor format](https://backstage.io/docs/features/software-catalog/descriptor-format).

## Kinds

| Kind | Is | Example in this course |
| --- | --- | --- |
| Domain | A business area | `commerce` |
| System | Components and APIs that work together | `shop` |
| Component | A piece of software you deploy or ship | `checkout` |
| API | A boundary between components | `checkout-api` |
| Resource | Infrastructure a component needs | `checkout-db` |
| Group / User | Teams and people | `team-checkout`, you |
| Location | A pointer to more YAML | added for you |
| Template | A software template | `node-service` |

## Refs and relations

An entity ref is `kind:namespace/name`, for example `group:default/team-checkout`.
Kind and namespace can be left out where a field implies them (`owner: team-checkout`).

You write one side; the catalog adds the other:

| You write | The catalog adds |
| --- | --- |
| `spec.owner` | `ownedBy` / `ownerOf` |
| `spec.system` | `partOf` / `hasPart` |
| `spec.providesApis` | `providesApi` / `apiProvidedBy` |
| `spec.dependsOn` | `dependsOn` / `dependencyOf` |
| `spec.memberOf` | `memberOf` / `hasMember` |

A ref to an entity that does not exist is **not an error**. The relation is
stored and the link in the UI leads nowhere. Typos survive until someone looks.

## Processing loop

Providers and locations hand entities to the catalog. Processors validate them,
read `$text` / `$json` references and emit relations. Each entity is processed
again on a loop, so a change in Git shows up after the next refresh, not
instantly. [Life of an entity](https://backstage.io/docs/features/software-catalog/life-of-an-entity)
