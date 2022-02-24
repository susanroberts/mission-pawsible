import React from "react"

const StepTile = props => {
  if (props.step.durationSeconds < 10) {
    props.step.durationSeconds = "0" + props.step.durationSeconds.toString()
  }

  return (
    <tr>
      <td>{props.step.item}</td>
      <td>{props.step.action}</td>
      <td>{props.step.durationMinutes}:{props.step.durationSeconds}</td>
      <td>{props.step.anxietyLevel}</td>
    </tr>
  )
}

export default StepTile