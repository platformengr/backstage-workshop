import { createPermission } from '@backstage/plugin-permission-common';

/** Read scorecards. @public */
export const readinessScorecardReadPermission = createPermission({
  name: 'readiness.scorecard.read',
  attributes: { action: 'read' },
});

/** Evaluate an entity now, outside the schedule. @public */
export const readinessEvaluatePermission = createPermission({
  name: 'readiness.evaluate',
  attributes: { action: 'update' },
});

/** Every permission the readiness plugin checks. @public */
export const readinessPermissions = [
  readinessScorecardReadPermission,
  readinessEvaluatePermission,
];
