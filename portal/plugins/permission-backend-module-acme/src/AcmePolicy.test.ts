import { mockCredentials } from '@backstage/backend-test-utils';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import {
  readinessEvaluatePermission,
  readinessScorecardReadPermission,
} from '@internal/backstage-plugin-readiness-common';
import { AcmePolicy } from './AcmePolicy';

const user = (...ownershipEntityRefs: string[]) => ({
  credentials: mockCredentials.user(),
  info: { userEntityRef: 'user:default/someone', ownershipEntityRefs },
});

describe('AcmePolicy', () => {
  const policy = new AcmePolicy();

  it('lets everyone read scorecards', async () => {
    const decision = await policy.handle(
      { permission: readinessScorecardReadPermission },
      user('group:default/team-checkout'),
    );
    expect(decision.result).toBe(AuthorizeResult.ALLOW);
  });

  it('lets only the platform team evaluate', async () => {
    const permission = readinessEvaluatePermission;
    expect(
      (await policy.handle({ permission }, user('group:default/platform')))
        .result,
    ).toBe(AuthorizeResult.ALLOW);
    expect(
      (await policy.handle({ permission }, user('group:default/team-checkout')))
        .result,
    ).toBe(AuthorizeResult.DENY);
  });
});
