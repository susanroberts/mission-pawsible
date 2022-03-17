import React, {useState, useEffect} from "react"
import { Link, useParams, Redirect } from "react-router-dom"

import StepList from "./StepList"
import UpdateMission from "./UpdateMission"

const MissionShow = props => {
  const params = useParams()
  const [mission, setMission] = useState({
    notes: null,
    dateString: "",
    steps: []
  })
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [editMode, setEditMode] = useState(false)

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
      body.mission.dateString = new Date(body.mission.sessionDate).toDateString()
      setMission(body.mission)
    } catch (error) {
      console.error("Error in fetch", error)
    }
  }

  const deleteMission = async () => {
    const { missionId } = params
    try {
      const response = await fetch(`/api/v1/${props.user.id}/missions/${missionId}`, {
        method: "DELETE",
        headers: new Headers ({
          "Content-Type": "application/json"
        }),
        body: JSON.stringify({ request: "Delete this"})
      })
      if (response.status === 201) {
        setShouldRedirect(true)
      }
    } catch (err) {
      console.error("Error in fetch", err)
    }
  }

  const toggleEdit = () => {
    setEditMode(!editMode)
  }
  
  let notes
  if (mission.notes) {
    notes = [<p key="notesTag">Notes:</p>, <p key="notesBody">{mission.notes}</p>]
  }
  
  useEffect(() => {
    getMission()
  }, [editMode])

  if (shouldRedirect) {
    return <Redirect push to="/missions" />
  }

  if (editMode) {
    return <UpdateMission mission={mission} toggleEdit={toggleEdit} user={props.user}/>
  }

  return (
    <div className="grid-x grid-margin-x">
      <div className="cell small-2" />
      <div className="cell small-8 opal-tile">
        <h1>Mission from {mission.dateString}</h1>
        <StepList steps={mission.steps} />
        {notes}
        <div className="justify">
          <Link to="/missions" className="link button">Back to missions</Link>
          <div className="inline">
            <a className="edit button" onClick={toggleEdit}>Edit</a>
            <a className="delete button" onClick={deleteMission}>Delete</a>
          </div>
        </div>
      </div>
      <div className="cell small-2" />
    </div>
  )
}

export default MissionShow