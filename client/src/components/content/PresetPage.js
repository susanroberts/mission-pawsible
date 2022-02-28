import React, { useState, useEffect} from 'react'
import EditPresetsForm from './EditPresetsForm'

import SimpleListItem from './SimpleListItem'

const PresetPage = props => {
  const [actions, setActions] = useState([])
  const [editMode, setEditMode] = useState(false)

  const getPresets = async () => {
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

  useEffect(() => {
    getPresets()
  }, [])

  const toggleEdit = () => {
    setEditMode(!editMode)
  }

  if (editMode) {
    return <EditPresetsForm actions={actions} toggleEdit={toggleEdit} user={props.user}/>
  }

  const actionTiles = actions.map(action => {
    return <SimpleListItem description={action.description} key={action.id}/>
  })

  return (
    <div className="grid-x grid-margin-x">
      <div className="cell small-2" />
      <div className="cell small-8 opal-tile">
        <h4>Saved Actions</h4>
        <ul>
          {actionTiles}
        </ul>
        <a className="edit button" onClick={toggleEdit}>Edit</a>
      </div>
      <div className="cell small-2" />
    </div>
  )
}

export default PresetPage