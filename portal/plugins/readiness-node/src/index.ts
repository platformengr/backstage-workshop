/**
 * What backend modules use to extend the readiness plugin.
 *
 * @packageDocumentation
 */
import { createExtensionPoint } from '@backstage/backend-plugin-api';
import type { ReadinessCheck } from '@internal/backstage-plugin-readiness-common';

export type { ReadinessCheck } from '@internal/backstage-plugin-readiness-common';

/** Lets a backend module add checks to the readiness plugin. @public */
export interface ReadinessChecksExtensionPoint {
  addCheck(...checks: ReadinessCheck[]): void;
}

/** @public */
export const readinessChecksExtensionPoint =
  createExtensionPoint<ReadinessChecksExtensionPoint>({
    id: 'readiness.checks',
  });
