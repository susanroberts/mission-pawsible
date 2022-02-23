const Model = require("./Model.js")

class Mission extends Model {
  static get tableName() {
    return "missions"
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["userId"],
      properties: {
        userId: { type: "string" },
        notes: { type: ["string", "null"]}
      }
    }
  }

  static get relationMappings() {
    const MissionStep = require("./MissionStep.js")

    return {
      steps: {
        relation: Model.HasManyRelation,
        modelClass: MissionStep,
        join: {
          from: "missions.id",
          to: "missionSteps.missionId"
        }
      }
    }
  }
}

module.exports = Mission;