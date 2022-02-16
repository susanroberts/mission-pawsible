class MissionSerializer {
  static getSummary(missionArray) {
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
    const allowedAttributes = ["stepNumber", "item", "action", "duration", "anxietyLevel"]
    serializedMission.steps = mission.steps.map(step => {
      const serializedStep = {}
      allowedAttributes.forEach(attribute => {
        serializedStep[attribute] = step[attribute]
      })
      return serializedStep
    })
    return serializedMission
  }
}

export default MissionSerializer