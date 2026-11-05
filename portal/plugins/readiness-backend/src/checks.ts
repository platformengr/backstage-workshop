import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import {
  CheckResult,
  ReadinessCheck,
  Scorecard,
} from '@internal/backstage-plugin-readiness-common';

const pass = { passed: true };
const fail = (message: string) => ({ passed: false, message });

/** The checks every component gets. Modules add more. */
export const defaultChecks: ReadinessCheck[] = [
  {
    id: 'has-owner',
    title: 'Has an owner',
    evaluate: e => (e.spec?.owner ? pass : fail('Set spec.owner to a team.')),
  },
  {
    id: 'has-system',
    title: 'Belongs to a system',
    evaluate: e => (e.spec?.system ? pass : fail('Set spec.system.')),
  },
  {
    id: 'has-lifecycle',
    title: 'Has a lifecycle',
    evaluate: e => (e.spec?.lifecycle ? pass : fail('Set spec.lifecycle.')),
  },
  {
    id: 'has-techdocs',
    title: 'Has TechDocs',
    evaluate: e =>
      e.metadata.annotations?.['backstage.io/techdocs-ref']
        ? pass
        : fail('Add the backstage.io/techdocs-ref annotation.'),
  },
  {
    id: 'has-runbook',
    title: 'Links a runbook',
    evaluate: e =>
      e.metadata.links?.some(l => /runbook/i.test(l.title ?? l.url))
        ? pass
        : fail('Add a link titled Runbook under metadata.links.'),
  },
];

/** Runs every check on one entity. A check that throws counts as failed. */
export async function scoreEntity(
  entity: Entity,
  checks: ReadinessCheck[],
): Promise<Scorecard> {
  const results: CheckResult[] = [];
  for (const check of checks) {
    const { id, title } = check;
    try {
      results.push({ id, title, ...(await check.evaluate(entity)) });
    } catch (error) {
      results.push({
        id,
        title,
        passed: false,
        message: `Check failed: ${error}`,
      });
    }
  }
  const passed = results.filter(r => r.passed).length;
  return {
    entityRef: stringifyEntityRef(entity),
    score: results.length ? Math.round((passed * 100) / results.length) : 0,
    checks: results,
    evaluatedAt: new Date().toISOString(),
  };
}
