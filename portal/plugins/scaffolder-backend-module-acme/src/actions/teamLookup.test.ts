import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { createTeamLookupAction } from './teamLookup';

const catalog = catalogServiceMock({
  entities: [
    {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Group',
      metadata: { name: 'team-checkout', title: 'Team Checkout' },
      spec: { type: 'team', children: [] },
    },
    {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Group',
      metadata: { name: 'acme' },
      spec: { type: 'organization', children: [] },
    },
  ],
});

describe('acme:team:lookup', () => {
  const action = createTeamLookupAction({ catalog });

  it('returns the team title', async () => {
    const ctx = createMockActionContext({
      input: { owner: 'group:default/team-checkout' },
    });
    await action.handler(ctx);
    expect(ctx.output).toHaveBeenCalledWith('title', 'Team Checkout');
  });

  it('rejects a group that is not a team', async () => {
    const ctx = createMockActionContext({
      input: { owner: 'group:default/acme' },
    });
    await expect(action.handler(ctx)).rejects.toThrow('is not a team');
  });

  it('rejects an owner that does not exist', async () => {
    const ctx = createMockActionContext({
      input: { owner: 'group:default/nobody' },
    });
    await expect(action.handler(ctx)).rejects.toThrow('is not a team');
  });
});
