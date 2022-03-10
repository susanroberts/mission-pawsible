const cleanMissionForm = formInput => {
  if (formInput.notes === "") {
    delete formInput.notes
  }
  if (formInput.date === "") {
    delete formInput.date
  }
  formInput.steps.forEach(step => {
    const { durationMinutes, durationSeconds } = step
    step.duration = parseInt(durationMinutes) * 60 + parseInt(durationSeconds)
    delete step.durationMinutes
    delete step.durationSeconds
    Object.keys(step).forEach(field => {
      if (step[field] === "") {
        delete step[field]
      }
    })
    return step
  })
  return formInput
}

export default cleanMissionForm