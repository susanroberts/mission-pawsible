const cleanMissionForm = formInput => {
  if (formInput.notes === "") {
    delete formInput.notes
  }
  formInput.steps.forEach(step => {
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