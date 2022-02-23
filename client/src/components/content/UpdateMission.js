import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"

import ErrorList from "../layout/ErrorList.js"
import translateServerErrors from "../../services/translateServerErrors.js"

const UpdateMission = props => {
  const params = useParams()
  const [form, setForm] = useState({
    notes: "",
    steps: []
  })
  const [errors, setErrors] = useState([])
  
  const handleChange = event => {
    const inputName = event.currentTarget.name.split(" ")
    const stepIndex = parseInt(inputName[0])
    const fieldName = inputName[1]
    const updatedSteps = form.steps.concat()
    updatedSteps[stepIndex][fieldName] = event.currentTarget.value
    setForm({ 
      ...form,
      steps: updatedSteps
    })
  }
  
  const noteChange = event => {
    setForm({
      ...form,
      notes: event.currentTarget.value
    })
  }
  
  const itemInputs = form.steps.map((step, i) => {
    return <input
      key={`${i} item`}
      type="text"
      name={`${i} item`}
      value={form.steps[i].item}
      onChange={handleChange}
    />
  })
  const actionInputs = form.steps.map((step, i) => {
    return <input
      key={`${i} action`}
      type="text"
      name={`${i} action`}
      value={form.steps[i].action}
      onChange={handleChange}
    />
  })
  const durationInputs = form.steps.map((step, i) => {
    return <input
      key={`${i} duration`}
      type="text"
      name={`${i} duration`}
      value={form.steps[i].duration}
      onChange={handleChange}
    />
  })
  const anxietyInputs = form.steps.map((step, i) => {
    return <input
      key={`${i} anxietyLevel`}
      type="number"
      min={0}
      max={5}
      name={`${i} anxietyLevel`}
      value={form.steps[i].anxietyLevel}
      onChange={handleChange}
    />
  })

  const generateForm = () => {
    setForm({
      notes: props.mission.notes,
      steps: props.mission.steps
    })
  }

  const handleSubmit = async () => {
    const { missionId } = params
    try {
      const response = await fetch(`/api/v1/${props.user.id}/missions/${missionId}`, {
        method: "PUT",
        headers: new Headers({
          "Content-Type": "application/json"
        }),
        body: JSON.stringify(form)
      })
      if (!response.ok) {
        if (response.status === 422) {
          const body = await response.json()
          const newErrors = translateServerErrors(body.errors)
          return setErrors(newErrors)
        }
      } else {
        props.toggleEdit()
      }
    } catch (err) {
      console.error("Error in fetch", err)
    }
  }

  useEffect(() => {
    generateForm()
  }, [])

  return (
    <div className="grid-x grid-margin-x">
      <div className="cell small-2" />
      <div className="cell small-8 opal-tile">
        <h1>Mission from {props.mission.date}</h1>
        <ErrorList errors={errors} />
        <div className="grid-x grid-padding-x align-bottom">
          <div className="cell small-3">
            <label>Item(s)</label>
            {itemInputs}
          </div>
          <div className="cell small-3">
            <label>Action</label>
            {actionInputs}
          </div>
          <div className="cell small-3">
            <label>Duration (minutes)</label>
            {durationInputs}
          </div>
          <div className="cell small-3">
            <label>Anxiety Level (0-5)</label>
            {anxietyInputs}
          </div>
        </div>
          <div className="cell small-8">
            <label htmlFor="notes">Notes:</label>
            <textarea name="notes" onChange={noteChange} value={form.notes} />
          </div>
        <p className="save button" onClick={handleSubmit}>Save</p>
        <p className="cancel button" onClick={props.toggleEdit}>Cancel</p>
      </div>
      <div className="cell small-2" />
    </div>
  )
}

export default UpdateMission