const Model = require("./Model.js")

class MissionStep extends Model {
  static get tableName() {
    return "missionSteps"
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["stepNumber", "action", "duration", "anxietyLevel"],
      properties: {
        stepNumber: "integer",
        item: "string",
        action: "string",
        duration: ["string", "integer"],
        anxietyLevel: ["string", "integer"]
      }
    }
  }

  static get relationMappings() {
    const Mission = require("./Mission.js")

    return {
      mission: {
        relation: Model.BelongsToOneRelation,
        modelClass: Mission,
        join: {
          from: "missionSteps.missionId",
          to: "missions.id"
        }
      }
    }
  }
}

module.exports = MissionStep;