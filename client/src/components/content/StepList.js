import React from "react"

import StepTile from "./StepTile"

const StepList = props => {
  const rows = props.steps.map(step => {
    return (
      <StepTile key={step.stepNumber} step={step} />
    )
  })

  return (
    <table>
      <tbody>
        <tr>
          <th>Item(s)</th>
          <th>Action</th>
          <th>Duration (mm:ss)</th>
          <th>Anxiety Level</th>
        </tr>
        {rows}
      </tbody>
    </table>
  )
}

export default StepList