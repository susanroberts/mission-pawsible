import { Mission } from "../models/index.js"

class MissionSerializer {
  static getSummary(missionArray) {
    missionArray.forEach(mission => {
      if (mission.sessionDate === null) {
        mission.sessionDate = mission.createdAt
      }
    })
    missionArray.sort((a, b) => {
      return b.sessionDate - a.sessionDate
    })
    const serializedMissions = missionArray.map(mission => {
      const cleanMission = {}
      cleanMission.id = mission.id
      cleanMission.sessionDate = mission.sessionDate.toDateString()
      return cleanMission
    })
    return serializedMissions
  }

  static async getDetails(mission) {
    mission.steps = await mission.$relatedQuery("steps")
    if (mission.sessionDate === null) {
      mission.sessionDate = mission.createdAt
    }
    const serializedMission = {
      notes: mission.notes,
      sessionDate: mission.sessionDate
    }
    const allowedAttributes = ["id", "stepNumber", "item", "action", "anxietyLevel"]
    serializedMission.steps = mission.steps.map(step => {
      const serializedStep = {}
      serializedStep.durationMinutes = Math.floor(step.duration / 60)
      serializedStep.durationSeconds = step.duration % 60
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
    const missions = await Mission.query().where("userId", userId).whereBetween("sessionDate", [rangeStart, rangeEnd])
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
    const missions = await Mission.query().where("userId", userId).whereBetween("sessionDate", [rangeStart, rangeEnd])
    missions.forEach(mission => {
      if (mission.sessionDate === null) {
        mission.sessionDate = mission.createdAt
      }
    })
    missions.sort((a, b) => {
      return b.sessionDate - a.sessionDate
    })
    const serializedMissions = this.getSummary(missions)
    return serializedMissions
  }

  static async getDurations(userId) {
    const missions = await Mission.query().where("userId", userId)
    for (const mission of missions) {
      if (mission.sessionDate === null) {
        mission.sessionDate = mission.createdAt
      }
      mission.steps = await mission.$relatedQuery("steps")
    }
    const durationArray = missions.map(mission => {
      let finalStep = { stepNumber: 0 }
      mission.steps.forEach(step => {
        if (step.stepNumber > finalStep.stepNumber) {
          finalStep = step
        }
      })
      const durationMin = finalStep.duration / 60
      return { sessionDate: mission.sessionDate, duration: durationMin }
    })
    return durationArray
  }
}

export default MissionSerializer