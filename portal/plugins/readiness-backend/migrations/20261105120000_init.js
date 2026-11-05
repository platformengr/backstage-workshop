// @ts-check

/** @param {import('knex').Knex} knex */
exports.up = async function up(knex) {
  await knex.schema.createTable('readiness_scorecards', table => {
    table
      .string('entity_ref')
      .primary()
      .comment('For example component:default/checkout');
    table
      .integer('score')
      .notNullable()
      .comment('Share of checks passed, 0 to 100');
    table.text('checks').notNullable().comment('The check results, as JSON');
    table.timestamp('evaluated_at', { useTz: true }).notNullable();
  });
};

/** @param {import('knex').Knex} knex */
exports.down = async function down(knex) {
  await knex.schema.dropTable('readiness_scorecards');
};
