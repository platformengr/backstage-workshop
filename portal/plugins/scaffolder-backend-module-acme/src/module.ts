import { createBackendModule } from '@backstage/backend-plugin-api';
import { catalogServiceRef } from '@backstage/plugin-catalog-node';
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node';
import { createTeamLookupAction } from './actions/teamLookup';

export const scaffolderModuleAcme = createBackendModule({
  pluginId: 'scaffolder',
  moduleId: 'acme',
  register({ registerInit }) {
    registerInit({
      deps: {
        scaffolderActions: scaffolderActionsExtensionPoint,
        catalog: catalogServiceRef,
      },
      async init({ scaffolderActions, catalog }) {
        scaffolderActions.addActions(createTeamLookupAction({ catalog }));
      },
    });
  },
});
