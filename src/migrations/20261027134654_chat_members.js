/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('chat_members', function(table) {
    table.integer('chatId').unsigned().notNullable()
      .references('chatId').inTable('chat_rooms');
    table.integer('userId').unsigned().notNullable()
      .references('id').inTable('users');
    table.timestamp('joinedAt').notNullable().defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('chat_members');
};
