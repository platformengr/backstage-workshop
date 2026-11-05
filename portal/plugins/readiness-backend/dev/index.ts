import { createBackend } from '@backstage/backend-defaults';
import { mockServices } from '@backstage/backend-test-utils';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';

// Runs the readiness plugin alone, with a fake catalog and no real auth:
//   yarn start   (in this folder)
//   curl -X POST localhost:7007/api/readiness/evaluate -H 'Content-Type: application/json' -d '{"entityRef":"component:default/sample"}'
const backend = createBackend();

backend.add(mockServices.auth.factory());
backend.add(mockServices.httpAuth.factory());
backend.add(
  catalogServiceMock.factory({
    entities: [
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: { name: 'sample' },
        spec: { type: 'service', owner: 'team-checkout' },
      },
    ],
  }),
);

backend.add(import('../src'));

backend.start();
