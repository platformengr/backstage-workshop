import {
  DatabaseService,
  resolvePackagePath,
} from '@backstage/backend-plugin-api';
import { Scorecard } from '@internal/backstage-plugin-readiness-common';
import { Knex } from 'knex';

const TABLE = 'readiness_scorecards';

type Row = {
  entity_ref: string;
  score: number;
  checks: string;
  evaluated_at: Date | string;
};

/** Keeps the latest scorecard per entity in the plugin's own database. */
export class ReadinessStore {
  static async create(database: DatabaseService): Promise<ReadinessStore> {
    const client = await database.getClient();
    if (!database.migrations?.skip) {
      await client.migrate.latest({
        directory: resolvePackagePath(
          '@internal/backstage-plugin-readiness-backend',
          'migrations',
        ),
      });
    }
    return new ReadinessStore(client);
  }

  private constructor(private readonly db: Knex) {}

  async save(card: Scorecard): Promise<void> {
    await this.db<Row>(TABLE)
      .insert({
        entity_ref: card.entityRef,
        score: card.score,
        checks: JSON.stringify(card.checks),
        evaluated_at: new Date(card.evaluatedAt),
      })
      .onConflict('entity_ref')
      .merge();
  }

  async get(entityRef: string): Promise<Scorecard | undefined> {
    const row = await this.db<Row>(TABLE)
      .where({ entity_ref: entityRef })
      .first();
    return row ? toScorecard(row) : undefined;
  }

  async list(): Promise<Scorecard[]> {
    const rows = await this.db<Row>(TABLE).orderBy('score', 'asc');
    return rows.map(toScorecard);
  }
}

function toScorecard(row: Row): Scorecard {
  return {
    entityRef: row.entity_ref,
    score: row.score,
    checks: JSON.parse(row.checks),
    evaluatedAt: new Date(row.evaluated_at).toISOString(),
  };
}
