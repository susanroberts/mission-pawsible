/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
 exports.up = async (knex) => {
  return knex.schema.createTable("missionSteps", t => {
    t.bigIncrements("id")
    t.bigInteger("missionId")
      .unsigned()
      .notNullable()
      .references("missions.id")
    t.integer("stepNumber").notNullable()
    t.string("item")
    t.string("action").notNullable()
    t.integer("duration").notNullable()
    t.integer("anxietyLevel").notNullable()
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
  return knex.schema.dropTableIfExists("missionSteps")
}
