import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"

import MissionTile from "./MissionTile"
import DurationGraph from "./DurationGraph"

const Dashboard = props => {
  const [thisWeek, setThisWeek] = useState([])
  const [lastWeek, setLastWeek] = useState([])

  const getMissions = async () => {
    try {
      const response = await fetch(`/api/v1/${props.user.id}/missions/recent`)
      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`
        const error = new Error(errorMessage)
        throw (error)
      }
      const body = await response.json()
      setThisWeek(body.thisWeek)
      setLastWeek(body.lastWeek)
    } catch (err) {
      console.error("Error in fetch", err)
    }
  }

  const thisWeekTiles = thisWeek.map(mission => {
    return <MissionTile key={mission.id} mission={mission} />
  })

  const lastWeekTiles = lastWeek.map(mission => {
    return <MissionTile key={mission.id} mission={mission} />
  })

  useEffect(() => {
    getMissions()
  }, [])

  return (
    <div className="grid-x grid-margin-x">
      <div className="cell small-2" />
      <div className="cell small-4">
        <div className="opal-tile">
          <h4>This week:</h4>
          <ul>
            {thisWeekTiles}
          </ul>
        </div>
        <div className="opal-tile">
          <h4>Last week:</h4>
          <ul>
            {lastWeekTiles}
          </ul>
        </div>
        <div className="inline">
          <h5 className="opal-tile inline"><Link to="/missions/new">Add a new mission</Link></h5>
          <h5 className="opal-tile inline"><Link to="/missions">View all past missions</Link></h5>
        </div>
      </div>
      <div className="cell small-4">
        <div className="opal-tile">
          <DurationGraph user={props.user}/>
        </div>
      </div>
      <div className="cell small-2" />
    </div>
  )
}

export default Dashboard