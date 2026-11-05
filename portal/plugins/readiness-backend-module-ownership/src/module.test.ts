import { startTestBackend } from '@backstage/backend-test-utils';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';
import readinessPlugin from '@internal/backstage-plugin-readiness-backend';
import request from 'supertest';
import { readinessModuleOwnership } from './module';

const component = (name: string, owner: string) => ({
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: { name },
  spec: { type: 'service', owner },
});

describe('readiness ownership module', () => {
  it('passes a team owner and fails a person', async () => {
    const { server } = await startTestBackend({
      features: [
        readinessPlugin,
        readinessModuleOwnership,
        catalogServiceMock.factory({
          entities: [
            {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'Group',
              metadata: { name: 'team-checkout' },
              spec: { type: 'team', children: [] },
            },
            component('checkout', 'team-checkout'),
            component('hobby', 'user:default/someone'),
          ],
        }),
      ],
    });

    const result = async (entityRef: string) => {
      const res = await request(server)
        .post('/api/readiness/evaluate')
        .send({ entityRef });
      return res.body.checks.find((c: any) => c.id === 'owner-is-team');
    };

    expect((await result('component:default/checkout')).passed).toBe(true);
    expect((await result('component:default/hobby')).passed).toBe(false);
  });
});
