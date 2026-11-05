import {
  AuthorizeResult,
  isPermission,
  PolicyDecision,
} from '@backstage/plugin-permission-common';
import {
  PermissionPolicy,
  PolicyQuery,
  PolicyQueryUser,
} from '@backstage/plugin-permission-node';
import { readinessEvaluatePermission } from '@internal/backstage-plugin-readiness-common';

/** Owned by the platform team. One place that says who may do what. */
export class AcmePolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: PolicyQueryUser,
  ): Promise<PolicyDecision> {
    if (isPermission(request.permission, readinessEvaluatePermission)) {
      const refs = user?.info.ownershipEntityRefs ?? [];
      return {
        result: refs.includes('group:default/platform')
          ? AuthorizeResult.ALLOW
          : AuthorizeResult.DENY,
      };
    }
    return { result: AuthorizeResult.ALLOW };
  }
}
