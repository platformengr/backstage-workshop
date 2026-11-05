import type { Entity } from '@backstage/catalog-model';

/** What one check says about one entity. @public */
export type CheckOutcome = { passed: boolean; message?: string };

/** One rule an entity must pass to be production ready. @public */
export interface ReadinessCheck {
  id: string;
  title: string;
  evaluate(entity: Entity): CheckOutcome | Promise<CheckOutcome>;
}

/** The outcome of one check, as stored and sent to the frontend. @public */
export type CheckResult = CheckOutcome & { id: string; title: string };

/** Every check for one entity, and the share that passed (0 to 100). @public */
export type Scorecard = {
  entityRef: string;
  score: number;
  checks: CheckResult[];
  evaluatedAt: string;
};
