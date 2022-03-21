import React, { useState, useEffect, Fragment } from "react"
import { useParams } from "react-router-dom"

import ErrorList from "../layout/ErrorList.js"
import translateServerErrors from "../../services/translateServerErrors.js"

const UpdateMission = props => {
  const params = useParams()
  const [form, setForm] = useState({
    notes: "",
    sessionDate: "",
    editDate: "",
    steps: []
  })
  const [errors, setErrors] = useState([])
  
  const handleChange = event => {
    if (event.currentTarget.name === "notes") {
      setForm({
        ...form,
        notes: event.currentTarget.value
      })
    } else if (event.currentTarget.name === "date") {
      setForm({
        ...form,
        editDate: event.currentTarget.value
      })
    } else {
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
    return (
      <Fragment key={`${i} duration`}>
        <input
          key={`${i} durationMinutes`}
          type="number"
          name={`${i} durationMinutes`}
          className="durationInput"
          value={form.steps[i].durationMinutes}
          onChange={handleChange}
        />
        <p className="inline pre"> : </p>
        <input
          key={`${i} durationSeconds`}
          type="number"
          name={`${i} durationSeconds`}
          className="durationInput"
          value={form.steps[i].durationSeconds}
          onChange={handleChange}
          max={59}
        />
        <br/>
      </Fragment>
      )
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
    let missionNotes = props.mission.notes
    if (missionNotes === null) {
      missionNotes = ""
    }
    setForm({
      notes: missionNotes,
      sessionDate: props.mission.sessionDate,
      editDate: props.mission.editDate,
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
        <h1>Mission from {form.sessionDate}</h1>
        <ErrorList errors={errors} />
        <div className="grid-x grid-padding-x align-bottom">
          <div className="cell small-3">
            <label htmlFor="date" className="bold">Date</label>
              <input
                type="date"
                value={form.editDate}
                onChange={handleChange}
                name="date"
                id="date"
              />
            <label className="bold">Item(s)</label>
            {itemInputs}
          </div>
          <div className="cell small-3">
            <label className="bold">Action</label>
            {actionInputs}
          </div>
          <div className="cell small-3">
            <label className="bold">Duration (mm:ss)</label>
            {durationInputs}
          </div>
          <div className="cell small-3">
            <label className="bold">Anxiety Level (0-5)</label>
            {anxietyInputs}
          </div>
        </div>
          <div className="cell small-8">
            <label htmlFor="notes" className="bold">Notes:</label>
            <textarea name="notes" onChange={handleChange} value={form.notes} />
          </div>
        <p className="button" onClick={handleSubmit}>Save</p>
        <p className="button" onClick={props.toggleEdit}>Cancel</p>
      </div>
      <div className="cell small-2" />
    </div>
  )
}

export default UpdateMission