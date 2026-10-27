/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('chat_rooms', function(table) {
        table.increments('chatId').primary();
        table.enu('type', ['individual', 'group']).defaultTo('individual');
        table.timestamp('createAt').notNullable().defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('chat_rooms');
};
