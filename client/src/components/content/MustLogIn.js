import React from "react"

const MustLogIn = props => {
  return (
    <div className="grid-x grid-margin-x">
      <div className="cell small-2" />
      <div className="cell small-8 opal-tile">
        <h1>You must be logged in to view this page</h1>
      </div>
      <div className="cell small-2" />
    </div>
  )
}

export default MustLogIn