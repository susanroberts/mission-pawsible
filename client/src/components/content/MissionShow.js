import React, {useState, useEffect} from "react"
import { Link, useParams } from "react-router-dom"

import StepList from "./StepList"

const MissionShow = props => {
  const params = useParams()
  const [mission, setMission] = useState({
    notes: null,
    steps: []
  })

  const getMission = async () => {
    const { missionId } = params
    try {
      const response = await fetch(`/api/v1/${props.user.id}/missions/${missionId}`)
      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`
        const error = new Error(errorMessage)
        throw (error)
      }
      const body = await response.json()
      setMission(body.mission)
    } catch (error) {
      console.error("Error in fetch", error)
    }
  }

  let notes
  if (mission.notes) {
    notes = [<p>Notes:</p>, <p>{mission.notes}</p>]
  }

  useEffect(() => {
    getMission()
  }, [props])

  return (
    <div className="grid-x grid-margin-x">
      <div className="cell small-2" />
      <div className="cell small-8 opal-tile">
        <h1>Mission from {mission.date}</h1>
        <StepList steps={mission.steps} />
        {notes}
        <p className="link-button"><Link to="/missions">Back to missions</Link></p>
      </div>
      <div className="cell small-2" />
    </div>
  )
}

export default MissionShow