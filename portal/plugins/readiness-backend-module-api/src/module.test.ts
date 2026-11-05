import { startTestBackend } from '@backstage/backend-test-utils';
import readinessPlugin from '@internal/backstage-plugin-readiness-backend';
import request from 'supertest';
import { providesApiCheck, readinessModuleApi } from './module';

describe('readiness api module', () => {
  it('adds its check to the plugin', async () => {
    const { server } = await startTestBackend({
      features: [readinessPlugin, readinessModuleApi],
    });
    const res = await request(server).get('/api/readiness/checks');
    expect(res.body.items).toContainEqual({
      id: 'provides-api',
      title: 'Services provide an API',
    });
  });

  it('fails a service without APIs', async () => {
    const outcome = await providesApiCheck.evaluate({
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: { name: 'payments' },
      spec: { type: 'service' },
    });
    expect(outcome.passed).toBe(false);
  });
});
