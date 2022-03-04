const cleanPresetForm = form => {
  const cleanedForm = []
  form.forEach(preset => {
    preset.description = preset.description.trim()
    if (preset.description.length > 0) {
      cleanedForm.push(preset)
    }
  })
  return cleanedForm
}

export default cleanPresetForm