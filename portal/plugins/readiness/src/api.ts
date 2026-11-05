import {
  createApiRef,
  DiscoveryApi,
  FetchApi,
} from '@backstage/frontend-plugin-api';
import { parseEntityRef } from '@backstage/catalog-model';
import { ResponseError } from '@backstage/errors';
import type { Scorecard } from '@internal/backstage-plugin-readiness-common';

/** What the frontend can ask the readiness backend. */
export interface ReadinessApi {
  getScorecard(entityRef: string): Promise<Scorecard | undefined>;
  listScorecards(): Promise<Scorecard[]>;
  evaluate(entityRef: string): Promise<Scorecard>;
}

export const readinessApiRef = createApiRef<ReadinessApi>({
  id: 'plugin.readiness',
});

/** Calls the readiness backend with the signed-in user's token. */
export class ReadinessClient implements ReadinessApi {
  constructor(
    private readonly discoveryApi: DiscoveryApi,
    private readonly fetchApi: FetchApi,
  ) {}

  private async request(path: string, init?: RequestInit) {
    const baseUrl = await this.discoveryApi.getBaseUrl('readiness');
    const response = await this.fetchApi.fetch(`${baseUrl}${path}`, init);
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    return response.json();
  }

  async getScorecard(entityRef: string) {
    const { kind, namespace, name } = parseEntityRef(entityRef);
    try {
      return await this.request(`/scorecards/${kind}/${namespace}/${name}`);
    } catch (e) {
      if (e instanceof ResponseError && e.statusCode === 404) {
        return undefined;
      }
      throw e;
    }
  }

  async listScorecards() {
    return (await this.request('/scorecards')).items;
  }

  async evaluate(entityRef: string) {
    return this.request('/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entityRef }),
    });
  }
}
