import React from "react"

const StepTile = props => {
  return (
    <tr>
      <td>{props.step.item}</td>
      <td>{props.step.action}</td>
      <td>{props.step.duration}</td>
      <td>{props.step.anxietyLevel}</td>
    </tr>
  )
}

export default StepTile