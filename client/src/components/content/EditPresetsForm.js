import React, { useState, useEffect } from "react"

const EditPresetsForm = props => {
  const [form, setForm] = useState([])

  const generateForm = () => {
    setForm(props.actions)
  }

  const handleChange = event => {
    const newValues = form.concat()
    const changeIndex = parseInt(event.currentTarget.name)
    newValues[changeIndex].description = event.currentTarget.value
    setForm(newValues)
    
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/v1/${props.user.id}/presets`, {
        method: "PUT",
        headers: new Headers({
          "Content-Type": "application/json"
        }),
        body: JSON.stringify(form)
      })
      if (response.ok) {
        props.toggleEdit()
      }
    } catch (err) {
      console.error("Error in fetch", err)
    }
  }

  useEffect(() => {
    generateForm()
  }, [])

  const actionInputs = form.map((action, i) => {
    return (
      <input
        key={action.id}
        type="text"
        name={i}
        value={form[i].description}
        onChange={handleChange}
      />
    )
  })

  return (
    <div className="grid-x grid-margin-x">
      <div className="cell small-2" />
      <div className="cell small-8 opal-tile">
        <h4>Updating Actions</h4>
        {actionInputs}
        <a className="button" onClick={handleSubmit}>Save</a>
        <a className="button" onClick={props.toggleEdit}>Cancel</a>
      </div>
      <div className="cell small-2" />
    </div>
  )
}

export default EditPresetsForm