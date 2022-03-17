import React from "react"
import { Link } from "react-router-dom"

const MissionTile = props => {
  return (
    <li><Link to={`/missions/${props.mission.id}`}>{props.mission.sessionDate}</Link></li>
  )
}

export default MissionTile