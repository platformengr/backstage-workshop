import { createBackendModule } from '@backstage/backend-plugin-api';
import {
  ReadinessCheck,
  readinessChecksExtensionPoint,
} from '@internal/backstage-plugin-readiness-node';

/** Owned by team-checkout: services must say which APIs they serve. */
export const providesApiCheck: ReadinessCheck = {
  id: 'provides-api',
  title: 'Services provide an API',
  evaluate: entity => {
    if (entity.spec?.type !== 'service') {
      return { passed: true, message: 'Not a service.' };
    }
    const apis = entity.spec?.providesApis as string[] | undefined;
    return apis?.length
      ? { passed: true }
      : {
          passed: false,
          message: 'List the APIs it serves in spec.providesApis.',
        };
  },
};

export const readinessModuleApi = createBackendModule({
  pluginId: 'readiness',
  moduleId: 'api',
  register(reg) {
    reg.registerInit({
      deps: { checks: readinessChecksExtensionPoint },
      async init({ checks }) {
        checks.addCheck(providesApiCheck);
      },
    });
  },
});
