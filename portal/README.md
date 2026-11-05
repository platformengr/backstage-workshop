
## Readiness plugins (plugin course)

The packages under `plugins/readiness*` and `plugins/permission-backend-module-acme` are built in the
[Backstage plugin development](https://platformengr.com/learn/backstage-plugins/) course.

```sh
yarn tsc
yarn test --watchAll=false
yarn workspace backend start   # then: curl -H "Authorization: Bearer $PORTAL_API_TOKEN" localhost:7007/api/readiness/checks
```

Settings live under `readiness:` in `app-config.yaml`; the card's pass score under `app.extensions`.
