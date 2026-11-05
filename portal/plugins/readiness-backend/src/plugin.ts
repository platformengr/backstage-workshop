import {
  coreServices,
  createBackendPlugin,
  readSchedulerServiceTaskScheduleDefinitionFromConfig,
} from '@backstage/backend-plugin-api';
import { catalogServiceRef } from '@backstage/plugin-catalog-node';
import {
  ReadinessCheck,
  readinessPermissions,
} from '@internal/backstage-plugin-readiness-common';
import { readinessChecksExtensionPoint } from '@internal/backstage-plugin-readiness-node';
import { defaultChecks } from './checks';
import { ReadinessEvaluator } from './ReadinessEvaluator';
import { ReadinessStore } from './ReadinessStore';
import { createRouter } from './router';

/**
 * Production-readiness scorecards for catalog components.
 *
 * @public
 */
export const readinessPlugin = createBackendPlugin({
  pluginId: 'readiness',
  register(env) {
    // Modules add checks here before init runs.
    const checks: ReadinessCheck[] = [...defaultChecks];
    env.registerExtensionPoint(readinessChecksExtensionPoint, {
      addCheck(...added) {
        checks.push(...added);
      },
    });

    env.registerInit({
      deps: {
        auth: coreServices.auth,
        config: coreServices.rootConfig,
        database: coreServices.database,
        httpAuth: coreServices.httpAuth,
        httpRouter: coreServices.httpRouter,
        logger: coreServices.logger,
        permissions: coreServices.permissions,
        permissionsRegistry: coreServices.permissionsRegistry,
        scheduler: coreServices.scheduler,
        catalog: catalogServiceRef,
      },
      async init(deps) {
        const { auth, config, database, httpAuth, httpRouter, logger } = deps;
        const { permissions, permissionsRegistry, scheduler, catalog } = deps;

        permissionsRegistry.addPermissions(readinessPermissions);

        const disabled =
          config.getOptionalStringArray('readiness.disabledChecks') ?? [];
        const active = checks.filter(c => !disabled.includes(c.id));

        const store = await ReadinessStore.create(database);
        const evaluator = new ReadinessEvaluator({
          checks: active,
          catalog,
          store,
          auth,
          logger,
        });

        const schedule = config.has('readiness.schedule')
          ? readSchedulerServiceTaskScheduleDefinitionFromConfig(
              config.getConfig('readiness.schedule'),
            )
          : {
              frequency: { minutes: 30 },
              timeout: { minutes: 5 },
              initialDelay: { seconds: 15 },
            };
        await scheduler.scheduleTask({
          id: 'readiness-evaluate-all',
          ...schedule,
          fn: () => evaluator.evaluateAll(),
        });

        httpRouter.use(
          await createRouter({
            httpAuth,
            permissions,
            store,
            evaluator,
            checks: active,
          }),
        );
      },
    });
  },
});
