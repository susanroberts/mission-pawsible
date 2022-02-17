import React from "react"
import { Link } from "react-router-dom"

import panic_to_calm from "../../../public/panic_to_calm.png"

const SplashPage = props => {
  return (
    <div className="grid-x grid-padding-x">
      <div className="cell small-2" />
      <div className="cell small-8">
        <h2 className="centered">A strightforward tracker for separation anxiety training</h2>
        <img src={panic_to_calm} className="opal-tile rounded" />
        <br/>
        <div className="centered">
          <h6 className="link-button centered"><Link to="/users/new">Get started</Link></h6>
        </div>
      </div>
      <div className="cell small-2" />
    </div>
  )
}

export default SplashPage