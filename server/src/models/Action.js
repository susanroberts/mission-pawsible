const Model = require("./Model.js")

class Action extends Model {
  static get tableName() {
    return "actions"
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["description", "userId"],
      properties: {
        userId: { type: "string" },
        description: { type: "string" }
      }
    }
  }

  static get relationMappings() {
    const User = require("./User.js")

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "user.id",
          to: "actions.userId"
        }
      }
    }
  }
}

module.exports = Action;