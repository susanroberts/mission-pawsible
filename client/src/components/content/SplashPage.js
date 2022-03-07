import React from "react"
import { Link } from "react-router-dom"

import panic_to_calm from "../../../public/panic_to_calm.png"

const SplashPage = props => {
  return (
    <div className="grid-x grid-padding-x">
      <div className="cell small-2" />
      <div className="cell small-8">
        <h2 className="centered">A straightforward tracker for pet separation anxiety training</h2>
        <img src={panic_to_calm} className="opal-tile centered" />
      </div>
      <div className="cell small-2" />
    </div>
  )
}

export default SplashPage