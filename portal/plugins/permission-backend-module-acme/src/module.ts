import { createBackendModule } from '@backstage/backend-plugin-api';
import { policyExtensionPoint } from '@backstage/plugin-permission-node/alpha';
import { AcmePolicy } from './AcmePolicy';

export const permissionModuleAcme = createBackendModule({
  pluginId: 'permission',
  moduleId: 'acme',
  register({ registerInit }) {
    registerInit({
      deps: { policy: policyExtensionPoint },
      async init({ policy }) {
        policy.setPolicy(new AcmePolicy());
      },
    });
  },
});
