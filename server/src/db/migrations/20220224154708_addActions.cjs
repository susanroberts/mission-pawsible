/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
  return knex.schema.createTable("actions", t => {
    t.bigIncrements("id")
    t.bigInteger("userId")
      .unsigned()
      .notNullable()
      .references("users.id")
    t.string("description")
      .notNullable()
    t.timestamp("createdAt")
      .notNullable()
      .defaultTo(knex.fn.now())
    t.timestamp("updatedAt")
      .notNullable()
      .defaultTo(knex.fn.now())
  })
}

/**
 * @param {Knex} knex
 */
exports.down = (knex) => {
  return knex.schema.dropTableIfExists("actions")
}
