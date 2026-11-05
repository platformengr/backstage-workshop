import { screen } from '@testing-library/react';
import {
  renderInTestApp,
  TestApiProvider,
} from '@backstage/frontend-test-utils';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { readinessApiRef, ReadinessApi } from '../api';
import { ScorecardCard } from './ScorecardCard';

const entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: { name: 'checkout' },
  spec: { owner: 'team-checkout' },
};

const fakeApi: Partial<ReadinessApi> = {
  getScorecard: async entityRef => ({
    entityRef,
    score: 80,
    evaluatedAt: '2026-11-05T10:00:00.000Z',
    checks: [
      { id: 'has-owner', title: 'Has an owner', passed: true },
      {
        id: 'has-runbook',
        title: 'Links a runbook',
        passed: false,
        message: 'Add a link titled Runbook under metadata.links.',
      },
    ],
  }),
};

describe('ScorecardCard', () => {
  it('shows the score and the failing check', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[readinessApiRef, fakeApi]]}>
        <EntityProvider entity={entity}>
          <ScorecardCard passScore={90} />
        </EntityProvider>
      </TestApiProvider>,
    );
    expect(await screen.findByText(/80% Not ready/)).toBeInTheDocument();
    expect(screen.getByText(/Links a runbook/)).toBeInTheDocument();
  });
});
