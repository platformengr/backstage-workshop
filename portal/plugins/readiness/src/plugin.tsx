import {
  ApiBlueprint,
  createFrontendPlugin,
  discoveryApiRef,
  fetchApiRef,
  PageBlueprint,
} from '@backstage/frontend-plugin-api';
import {
  EntityCardBlueprint,
  EntityContentBlueprint,
} from '@backstage/plugin-catalog-react/alpha';
import { z } from 'zod/v4';
import { readinessApiRef, ReadinessClient } from './api';
import { rootRouteRef } from './routes';

/** How the app gets a ReadinessApi: one client, built from two core APIs. */
export const readinessApi = ApiBlueprint.make({
  params: defineParams =>
    defineParams({
      api: readinessApiRef,
      deps: { discoveryApi: discoveryApiRef, fetchApi: fetchApiRef },
      factory: ({ discoveryApi, fetchApi }) =>
        new ReadinessClient(discoveryApi, fetchApi),
    }),
});

/** /readiness: every scorecard. The title puts it in the sidebar. */
export const readinessPage = PageBlueprint.make({
  params: {
    path: '/readiness',
    routeRef: rootRouteRef,
    title: 'Readiness',
    loader: () =>
      import('./components/ReadinessPage').then(m => <m.ReadinessPage />),
  },
});

/** The card on a component's overview. passScore comes from app-config. */
export const readinessCard = EntityCardBlueprint.makeWithOverrides({
  name: 'scorecard',
  configSchema: {
    passScore: z.number().default(75),
  },
  factory(originalFactory, { config }) {
    return originalFactory({
      filter: { kind: 'component' },
      loader: () =>
        import('./components/ScorecardCard').then(m => (
          <m.ScorecardCard passScore={config.passScore} />
        )),
    });
  },
});

/** The Readiness tab on a component's page. */
export const readinessContent = EntityContentBlueprint.make({
  params: {
    path: 'readiness',
    title: 'Readiness',
    filter: { kind: 'component' },
    loader: () =>
      import('./components/ReadinessContent').then(m => <m.ReadinessContent />),
  },
});

export const readinessPlugin = createFrontendPlugin({
  pluginId: 'readiness',
  extensions: [readinessApi, readinessPage, readinessCard, readinessContent],
  routes: {
    root: rootRouteRef,
  },
});
