import { Mission } from "../models/index.js"

class MissionSerializer {
  static getSummary(missionArray) {
    missionArray.sort((a, b) => {
      return b.createdAt - a.createdAt
    })
    const serializedMissions = missionArray.map(mission => {
      const cleanMission = {}
      cleanMission.id = mission.id
      cleanMission.date = mission.createdAt.toDateString()
      return cleanMission
    })
    return serializedMissions
  }

  static async getDetails(mission) {
    mission.steps = await mission.$relatedQuery("steps")
    const serializedMission = {
      notes: mission.notes,
      date: mission.createdAt.toDateString()
    }
    const allowedAttributes = ["id", "stepNumber", "item", "action", "duration", "anxietyLevel"]
    serializedMission.steps = mission.steps.map(step => {
      const serializedStep = {}
      allowedAttributes.forEach(attribute => {
        serializedStep[attribute] = step[attribute]
      })
      return serializedStep
    })
    return serializedMission
  }

  static async getThisWeek(userId) {
    let rangeStart = new Date()
    rangeStart.setDate(rangeStart.getDate() - (rangeStart.getDay() + 6) % 7)
    rangeStart.setHours(0, 0, 0, 0)
    let rangeEnd = new Date()
    const missions = await Mission.query().where("userId", userId).whereBetween("createdAt", [rangeStart, rangeEnd])
    missions.sort((a, b) => {
      return b.createdAt - a.createdAt
    })
    const serializedMissions = this.getSummary(missions)
    return serializedMissions
  }

  static async getLastWeek(userId) {
    let rangeEnd = new Date()
    rangeEnd.setDate(rangeEnd.getDate() - (rangeEnd.getDay() + 6) % 7)
    rangeEnd.setHours(0, 0, 0, 0)
    let rangeStart = new Date(rangeEnd.getTime() - 604800000)
    const missions = await Mission.query().where("userId", userId).whereBetween("createdAt", [rangeStart, rangeEnd])
    missions.sort((a, b) => {
      return b.createdAt - a.createdAt
    })
    const serializedMissions = this.getSummary(missions)
    return serializedMissions
  }

  static async getDurations(userId) {
    const missions = await Mission.query().where("userId", userId)
    for (const mission of missions) {
      mission.steps = await mission.$relatedQuery("steps")
    }
    const durationArray = missions.map(mission => {
      let finalStep = { stepNumber: 0 }
      mission.steps.forEach(step => {
        if (step.stepNumber > finalStep.stepNumber) {
          finalStep = step
        }
      })
      return { createdAt: mission.createdAt, duration: finalStep.duration }
    })
    return durationArray
  }
}

export default MissionSerializer