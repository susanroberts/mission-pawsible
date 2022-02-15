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
}

export default MissionSerializer