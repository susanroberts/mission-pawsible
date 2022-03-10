import React from "react"
import { Link } from "react-router-dom"

import panic_to_calm from "../../../public/panic_to_calm.png"

const SplashPage = props => {
  return (
    <div className="grid-x grid-padding-x">
      <div className="cell small-2" />
      <div className="cell small-8">
        <h2 className="centered">A tracker for pet separation anxiety training</h2>
        <p className="centered">This app was built as my capstone at Launch Academy. It uses NodeJS, ReactJS, ExpressJS, PostgreSQL and RESTful API. The code is available to view <a className="white" href="https://github.com/susanroberts/mission-pawsible" target="_blank">HERE</a> on GitHub.</p>
        <img src={panic_to_calm} className="opal-tile centered" />
      </div>
      <div className="cell small-2" />
    </div>
  )
}

export default SplashPage