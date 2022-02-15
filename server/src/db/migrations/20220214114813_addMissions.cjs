/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
  return knex.schema.createTable("missions", t => {
    t.bigIncrements("id")
    t.bigInteger("userId")
      .unsigned()
      .notNullable()
      .references("users.id")
    t.string("notes")
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
  return knex.schema.dropTableIfExists("missions")
}
