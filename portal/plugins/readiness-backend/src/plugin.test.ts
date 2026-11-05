import { mockServices, startTestBackend } from '@backstage/backend-test-utils';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import request from 'supertest';
import { readinessPlugin } from './plugin';

// A component like team-checkout's, without a runbook link.
const checkout = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'checkout',
    annotations: { 'backstage.io/techdocs-ref': 'dir:.' },
  },
  spec: {
    type: 'service',
    lifecycle: 'production',
    owner: 'team-checkout',
    system: 'shop',
  },
};

describe('readiness plugin', () => {
  it('scores a component and stores the scorecard', async () => {
    const { server } = await startTestBackend({
      features: [
        readinessPlugin,
        catalogServiceMock.factory({ entities: [checkout] }),
      ],
    });

    await request(server)
      .get('/api/readiness/scorecards/component/default/checkout')
      .expect(404);

    const res = await request(server)
      .post('/api/readiness/evaluate')
      .send({ entityRef: 'component:default/checkout' });
    expect(res.status).toBe(200);
    expect(res.body.score).toBe(80);
    expect(res.body.checks).toContainEqual(
      expect.objectContaining({ id: 'has-runbook', passed: false }),
    );

    const stored = await request(server).get(
      '/api/readiness/scorecards/component/default/checkout',
    );
    expect(stored.body.score).toBe(80);
  });

  it('returns 404 for an entity the catalog does not have', async () => {
    const { server } = await startTestBackend({
      features: [readinessPlugin, catalogServiceMock.factory({ entities: [] })],
    });
    await request(server)
      .post('/api/readiness/evaluate')
      .send({ entityRef: 'component:default/nope' })
      .expect(404);
  });

  it('answers 403 when the policy denies', async () => {
    const { server } = await startTestBackend({
      features: [
        readinessPlugin,
        catalogServiceMock.factory({ entities: [checkout] }),
        mockServices.permissions.factory({ result: AuthorizeResult.DENY }),
      ],
    });
    await request(server)
      .post('/api/readiness/evaluate')
      .send({ entityRef: 'component:default/checkout' })
      .expect(403);
  });
});
