import React, { useState, useEffect} from 'react'

import ActionTile from './ActionTile'

const PresetPage = props => {
  const [actions, setActions] = useState([])

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

  const actionTiles = actions.map(action => {
    return <ActionTile action={action} />
  })


  return (
    <ul>
      {actionTiles}
    </ul>
  )
}

export default PresetPage