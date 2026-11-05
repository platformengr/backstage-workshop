import { readinessPlugin } from './plugin';

describe('readiness', () => {
  it('should export plugin', () => {
    expect(readinessPlugin).toBeDefined();
  });
});
