import express from "express"
import Action from "../../../models/Action.js"

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

export default presetsRouter