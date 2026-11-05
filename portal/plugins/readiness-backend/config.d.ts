import { SchedulerServiceTaskScheduleDefinitionConfig } from '@backstage/backend-plugin-api';

export interface Config {
  /** Settings for the readiness backend plugin. Owned by the platform team. */
  readiness?: {
    /** How often every component is evaluated. Default: every 30 minutes. */
    schedule?: SchedulerServiceTaskScheduleDefinitionConfig;
    /** Check ids to switch off, for example has-runbook. */
    disabledChecks?: string[];
  };
}
