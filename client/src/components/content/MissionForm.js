import React, { useState } from "react"

import ErrorList from "../layout/ErrorList.js"
import translateServerErrors from "../../services/translateServerErrors.js"

const MissionForm = props => {
  const [errors, setErrors] = useState([])
  const [getForm, setForm] = useState({
    notes: "",
    steps: [
    {
      item: "",
      action: "",
      duration: "0",
      anxietyLevel: 0
    },
    {
      item: "",
      action: "",
      duration: "0",
      anxietyLevel: 0
    },
    {
      item: "",
      action: "",
      duration: "0",
      anxietyLevel: 0
    }
  ]})

  const handleChange = event => {
    const inputName = event.currentTarget.name.split(" ")
    const stepIndex = parseInt(inputName[0])
    const fieldName = inputName[1]
    const updatedSteps = getForm.steps.concat()
    updatedSteps[stepIndex][fieldName] = event.currentTarget.value
    setForm({ 
      ...getForm,
      steps: updatedSteps
    })
  }

  const noteChange = event => {
    setForm({
      ...getForm,
      notes: event.currentTarget.value
    })
  }

  const clearForm = () => {
    setForm({
      notes: "",
      steps: [
      {
        item: "",
        action: "",
        duration: "0",
        anxietyLevel: 0
      },
      {
        item: "",
        action: "",
        duration: "0",
        anxietyLevel: 0
      },
      {
        item: "",
        action: "",
        duration: "0",
        anxietyLevel: 0
      }
    ]})
  }
  
  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await fetch(`/api/v1/missions/${props.user.id}`, {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json"
        }),
        body: JSON.stringify(getForm)
      })
      if (!response.ok) {
        if (response.status === 422) {
          const body = await response.json()
          const newErrors = translateServerErrors(body.errors)
          return setErrors(newErrors)
        } else {
          const errorMessage = `${response.status} (${response.statusText})`
          const error = new Error(errorMessage)
          throw (error)
        }
      } else {
        setErrors([])
        clearForm()
        // eventually redirect to mission show page
      }
    } catch (err) {
      console.error("error in fetch", err)
    }
  }

  return (
    <div>
      <ErrorList errors={errors} />
      <form onSubmit={handleSubmit}>
        <div className="grid-x grid-padding-x align-bottom">
          <div className="cell small-2" />
          <div className="cell small-2">
            <label>Item(s)</label>
            <input
              type="text"
              name="0 item"
              value={getForm.steps[0].item}
              onChange={handleChange}
            />
            <input
              type="text"
              name="1 item"
              value={getForm.steps[1].item}
              onChange={handleChange}
            />
            <input
              type="text"
              name="2 item"
              value={getForm.steps[2].item}
              onChange={handleChange}
            />
          </div>
          <div className="cell small-2">
            <label>Action</label>
            <input
              type="text"
              name="0 action"
              value={getForm.steps[0].action}
              onChange={handleChange}
            />
            <input
              type="text"
              name="1 action"
              value={getForm.steps[1].action}
              onChange={handleChange}
            />
            <input
              type="text"
              name="2 action"
              value={getForm.steps[2].action}
              onChange={handleChange}
            />
          </div>
          <div className="cell small-2">
            <label>Duration (minutes)</label>
            <input
              type="text"
              name="0 duration"
              value={getForm.steps[0].duration}
              onChange={handleChange}
            />
            <input
              type="text"
              name="1 duration"
              value={getForm.steps[1].duration}
              onChange={handleChange}
            />
            <input
              type="text"
              name="2 duration"
              value={getForm.steps[2].duration}
              onChange={handleChange}
            />
          </div>
          <div className="cell small-2">
            <label>Anxiety Level (0-5)</label>
            <input
              type="number"
              min={0}
              max={5}
              name="0 anxietyLevel"
              value={getForm.steps[0].anxietyLevel}
              onChange={handleChange}
            />
            <input
              type="number"
              min={0}
              max={5}
              name="1 anxietyLevel"
              value={getForm.steps[1].anxietyLevel}
              onChange={handleChange}
            />
            <input
              type="number"
              min={0}
              max={5}
              name="2 anxietyLevel"
              value={getForm.steps[2].anxietyLevel}
              onChange={handleChange}
            />
          </div>
          <div className="cell small-2" />
          <div className="cell small-2" />
          <div className="cell small-8">
            <label htmlFor="notes">Notes:</label>
            <textarea name="notes" onChange={noteChange} value={getForm.notes} />
            <input type="submit" />
          </div>
        </div>
      </form>
    </div>
  )
}

export default MissionForm