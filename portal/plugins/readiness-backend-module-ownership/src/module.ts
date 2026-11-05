import {
  AuthService,
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { parseEntityRef } from '@backstage/catalog-model';
import {
  CatalogService,
  catalogServiceRef,
} from '@backstage/plugin-catalog-node';
import {
  ReadinessCheck,
  readinessChecksExtensionPoint,
} from '@internal/backstage-plugin-readiness-node';

/** The owner must be a team, not a person or a group that does not exist. */
export function ownerIsTeamCheck(
  catalog: CatalogService,
  auth: AuthService,
): ReadinessCheck {
  return {
    id: 'owner-is-team',
    title: 'Owned by a team',
    async evaluate(entity) {
      const owner = entity.spec?.owner as string | undefined;
      if (!owner) {
        return { passed: false, message: 'No owner.' };
      }
      const ref = parseEntityRef(owner, {
        defaultKind: 'group',
        defaultNamespace: entity.metadata.namespace ?? 'default',
      });
      const group = await catalog.getEntityByRef(ref, {
        credentials: await auth.getOwnServiceCredentials(),
      });
      return group?.kind === 'Group' && group.spec?.type === 'team'
        ? { passed: true }
        : { passed: false, message: `${owner} is not a team in the catalog.` };
    },
  };
}

export const readinessModuleOwnership = createBackendModule({
  pluginId: 'readiness',
  moduleId: 'ownership',
  register(reg) {
    reg.registerInit({
      deps: {
        checks: readinessChecksExtensionPoint,
        catalog: catalogServiceRef,
        auth: coreServices.auth,
      },
      async init({ checks, catalog, auth }) {
        checks.addCheck(ownerIsTeamCheck(catalog, auth));
      },
    });
  },
});
