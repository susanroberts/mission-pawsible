import express from "express"

import Action from "../../../models/Action.js"
import cleanPresetForm from "../../../services/cleanPresetForm.js"

const presetsRouter = new express.Router({ mergeParams: true })

presetsRouter.get("/", async (req, res) => {
  const { userId } = req.params
  try {
    const actions = await Action.query().where("userId", userId)
    return res.status(200).json({ actions })
  } catch (err) {
    return res.status(500).json({ errors: err })
  }
})

presetsRouter.put("/", async (req, res) => {
  const { userId } = req.params
  try {
    const updatedActions = cleanPresetForm(req.body)
    const actionsIds = []
    for (const action of updatedActions) {
      if (action.id) {
        actionsIds.push(action.id)
        await Action.query()
          .findById(action.id)
          .update(action)
      } else {
        await Action.query()
          .insert({ userId: userId, description: action.description })
      }
    }
    const actions = await Action.query().where("userId", userId)
    for (const existingAction of actions) {
      if (!actionsIds.includes(existingAction.id)) {
        await Action.query()
          .findById(existingAction.id)
          .delete()
      }
    }
    return res.status(201).json({ actions: "actions updated" })
  } catch (err) {
    return res.status(500).json({ errors: err })
  }
})

export default presetsRouter