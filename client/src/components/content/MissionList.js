import React, { useState, useEffect } from "react"

import MissionTile from "./MissionTile"

const MissionList = props => {
  const [missions, setMissions] = useState([])

  const getMissions = async () => {
    try {
      const response = await fetch(`/api/v1/${props.user.id}/missions`)
      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`
        const error = new Error(errorMessage)
        throw (error)
      }
      const body = await response.json()
      setMissions(body.missions)
    } catch (err) {
      console.error("Error in fetch", err)
    }
  }

  useEffect(() => {
    getMissions()
  }, [props])

  const missionTiles = missions.map(mission => {
    return (
      <MissionTile
        key={mission.id}
        mission={mission}
      />
    )
  })

  return (
    <div>
      <h1>My Missions</h1>
      <ul>
        {missionTiles}
      </ul>
    </div>
  )
}

export default MissionList