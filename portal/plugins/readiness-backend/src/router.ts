import {
  HttpAuthService,
  PermissionsService,
} from '@backstage/backend-plugin-api';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { InputError, NotAllowedError, NotFoundError } from '@backstage/errors';
import {
  AuthorizeResult,
  BasicPermission,
} from '@backstage/plugin-permission-common';
import {
  ReadinessCheck,
  readinessEvaluatePermission,
  readinessScorecardReadPermission,
} from '@internal/backstage-plugin-readiness-common';
import express from 'express';
import Router from 'express-promise-router';
import { z } from 'zod/v3';
import { ReadinessEvaluator } from './ReadinessEvaluator';
import { ReadinessStore } from './ReadinessStore';

export async function createRouter(options: {
  httpAuth: HttpAuthService;
  permissions: PermissionsService;
  store: ReadinessStore;
  evaluator: ReadinessEvaluator;
  checks: ReadinessCheck[];
}): Promise<express.Router> {
  const { httpAuth, permissions, store, evaluator, checks } = options;
  const router = Router();
  router.use(express.json());

  // Who is calling, and may they do this? Throws 403 if not.
  async function authorize(req: express.Request, permission: BasicPermission) {
    const credentials = await httpAuth.credentials(req);
    const [decision] = await permissions.authorize([{ permission }], {
      credentials,
    });
    if (decision.result !== AuthorizeResult.ALLOW) {
      throw new NotAllowedError(`Not allowed: ${permission.name}`);
    }
    return credentials;
  }

  router.get('/checks', async (_req, res) => {
    res.json({ items: checks.map(({ id, title }) => ({ id, title })) });
  });

  router.get('/scorecards', async (req, res) => {
    await authorize(req, readinessScorecardReadPermission);
    res.json({ items: await store.list() });
  });

  router.get('/scorecards/:kind/:namespace/:name', async (req, res) => {
    await authorize(req, readinessScorecardReadPermission);
    const entityRef = stringifyEntityRef(req.params);
    const card = await store.get(entityRef);
    if (!card) {
      throw new NotFoundError(`No scorecard for ${entityRef} yet`);
    }
    res.json(card);
  });

  const evaluateSchema = z.object({ entityRef: z.string() });

  router.post('/evaluate', async (req, res) => {
    const credentials = await authorize(req, readinessEvaluatePermission);
    const parsed = evaluateSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new InputError(parsed.error.toString());
    }
    res.json(
      await evaluator.evaluateEntity(parsed.data.entityRef, credentials),
    );
  });

  return router;
}
