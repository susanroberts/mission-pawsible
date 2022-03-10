import React, { useState, useEffect, Fragment } from "react"
import { Redirect } from "react-router-dom"

import ErrorList from "../layout/ErrorList.js"
import translateServerErrors from "../../services/translateServerErrors.js"

const MissionForm = props => {
  const [errors, setErrors] = useState([])
  const [form, setForm] = useState({
    notes: "",
    date: "",
    steps: []
  })
  const [shouldRedirect, setShouldRedirect] = useState([false, null])
  const [stepNum, setStepNum] = useState(1)
  const [actions, setActions] = useState([])
  
  const handleChange = event => {
    if (event.currentTarget.name === "notes") {
      setForm({
        ...form,
        notes: event.currentTarget.value
      })
    } else if (event.currentTarget.name === "date") {
      setForm({
        ...form,
        date: event.currentTarget.value
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

  const stepChange = event => {
    setStepNum(event.currentTarget.value)
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
  const actionsDataList = actions.map(action => {
    return (
      <option
        key={`${action.id} actionOption`}
        value={action.description}
      />
    )
  })
  const actionInputs = form.steps.map((step, i) => {
    return (
      <input
        key={`${i} action`}
        type="text"
        name={`${i} action`}
        value={form.steps[i].action}
        onChange={handleChange}
        list="actionList"
      />
    )
  })
  const durationInputs = form.steps.map((step, i) => {
    return (
    <Fragment>
      <input
        key={`${i} durationMinutes`}
        type="number"
        name={`${i} durationMinutes`}
        className="durationInput"
        value={form.steps[i].durationMinutes}
        onChange={handleChange}
        min={0}
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
        min={0}
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
  
  const generateForm = (steps) => {
    const updatedSteps = form.steps.concat()
    if (steps > updatedSteps.length) {
      for (let i = updatedSteps.length; i < steps; i++) {
        updatedSteps.push({
          item: "",
          action: "",
          durationMinutes: 0,
          durationSeconds: "00",
          anxietyLevel: 0
        })
      }
    } else if (steps < updatedSteps.length) {
      updatedSteps.splice(steps)
    }
    const today = new Date().toISOString().split("T")[0]
    setForm({
      ...form,
      date: today,
      steps: updatedSteps
    })
  }

  const getActions = async () => {
    try {
      const response = await fetch(`/api/v1/${props.user.id}/presets`)
      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusTest})`
        const error = new Error(errorMessage)
        throw(error)
      }
      const body = await response.json()
      setActions(body.actions)
    } catch (error) {
      console.error("Error in fetch", error)
    }
  }
  
  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await fetch(`/api/v1/${props.user.id}/missions`, {
        method: "POST",
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
        } else {
          const errorMessage = `${response.status} (${response.statusText})`
          const error = new Error(errorMessage)
          throw (error)
        }
      } else {
        const body = await response.json()
        setShouldRedirect([true, body.mission.id])
      }
    } catch (err) {
      console.error("error in fetch", err)
    }
  }

  useEffect(() => {
    getActions()
  }, [])
  
  useEffect(() => {
    generateForm(stepNum)
  }, [stepNum])

  if (shouldRedirect[0]) {
    return <Redirect push to={`/missions/${shouldRedirect[1]}`} />
  }

  return (
    <div>
      <ErrorList errors={errors} />
      <form onSubmit={handleSubmit}>
        <div className="grid-x grid-margin-x">
          <div className="cell small-2" />
          <div className="cell small-8 opal-tile">
            <div className="grid-x grid-margin-x align-bottom">
              <div className="cell small-2">
                <label htmlFor="date" className="bold">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  name="date"
                  id="date"
                />
                <label className="bold">Item(s)</label>
                {itemInputs}
              </div>
              <div className="cell small-5">
                <label className="bold">Action</label>
                <datalist id="actionList">
                  {actionsDataList}
                </datalist>
                {actionInputs}
              </div>
              <div className="cell small-3">
                <label className="bold">Duration (mm:ss)</label>
                {durationInputs}
              </div>
              <div className="cell small-2">
                <label htmlFor="stepNum" className="bold">Number of steps</label>
                <select name="stepNum" className="option" onChange={stepChange}>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                  <option value={6}>6</option>
                  <option value={7}>7</option>
                  <option value={8}>8</option>
                  <option value={9}>9</option>
                  <option value={10}>10</option>
                  <option value={11}>11</option>
                  <option value={12}>12</option>
                </select>
                <label className="bold">Anxiety Level (0-5)</label>
                {anxietyInputs}
              </div>
              <div className="cell small-12">
                <label htmlFor="notes" className="bold">Notes:</label>
                <textarea name="notes" onChange={handleChange} value={form.notes} />
                <input type="submit" className="button"/>
              </div>
            </div>
          </div>
          <div className="cell small-2" />
        </div>
      </form>
    </div>
  )
}

export default MissionForm