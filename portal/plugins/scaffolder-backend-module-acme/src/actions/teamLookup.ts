import { CatalogService } from '@backstage/plugin-catalog-node';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { InputError } from '@backstage/errors';

// acme:team:lookup checks that the owner picked in a template is a real team
// and returns its display name for the skeleton to use.
export function createTeamLookupAction(options: { catalog: CatalogService }) {
  const { catalog } = options;

  return createTemplateAction({
    id: 'acme:team:lookup',
    description: 'Checks that the owner is a team and returns its name',
    // Read-only, so it is safe to run in the template editor's dry run.
    supportsDryRun: true,
    schema: {
      input: {
        owner: z =>
          z.string({
            description:
              'Entity ref of the owner, e.g. group:default/team-checkout',
          }),
      },
      output: {
        title: z => z.string({ description: 'Display name of the team' }),
      },
    },
    async handler(ctx) {
      const entity = await catalog.getEntityByRef(ctx.input.owner, {
        credentials: await ctx.getInitiatorCredentials(),
      });

      if (entity?.kind !== 'Group' || entity.spec?.type !== 'team') {
        throw new InputError(`${ctx.input.owner} is not a team in the catalog`);
      }

      const title = entity.metadata.title ?? entity.metadata.name;
      ctx.logger.info(`Owner is ${title}`);
      ctx.output('title', title);
    },
  });
}
