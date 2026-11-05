import {
  AuthService,
  BackstageCredentials,
  LoggerService,
} from '@backstage/backend-plugin-api';
import { NotFoundError } from '@backstage/errors';
import {
  ReadinessCheck,
  Scorecard,
} from '@internal/backstage-plugin-readiness-common';
import { CatalogService } from '@backstage/plugin-catalog-node';
import { scoreEntity } from './checks';
import { ReadinessStore } from './ReadinessStore';

/** Reads entities from the catalog, scores them and stores the result. */
export class ReadinessEvaluator {
  constructor(
    private readonly options: {
      checks: ReadinessCheck[];
      catalog: CatalogService;
      store: ReadinessStore;
      auth: AuthService;
      logger: LoggerService;
    },
  ) {}

  /** One entity, on behalf of whoever asked. */
  async evaluateEntity(
    entityRef: string,
    credentials: BackstageCredentials,
  ): Promise<Scorecard> {
    const { catalog, checks, store } = this.options;
    const entity = await catalog.getEntityByRef(entityRef, { credentials });
    if (!entity) {
      throw new NotFoundError(`No entity ${entityRef} in the catalog`);
    }
    const card = await scoreEntity(entity, checks);
    await store.save(card);
    return card;
  }

  /** Every component, as the plugin itself. Run by the scheduler. */
  async evaluateAll(): Promise<void> {
    const { auth, catalog, checks, logger, store } = this.options;
    const credentials = await auth.getOwnServiceCredentials();
    const { items } = await catalog.getEntities(
      { filter: { kind: 'Component' } },
      { credentials },
    );
    for (const entity of items) {
      await store.save(await scoreEntity(entity, checks));
    }
    logger.info(
      `Evaluated ${items.length} components with ${checks.length} checks`,
    );
  }
}
