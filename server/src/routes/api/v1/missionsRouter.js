import express from "express"
import { ValidationError } from "objection"

import cleanMissionForm from "../../../services/cleanMissionForm.js"
import { User, Mission } from "../../../models/index.js"

const missionsRouter = new express.Router()

missionsRouter.get("/:userId", async (req, res) => {
  const { userId } = req.params
  try {
    const user = await User.query().findById(userId)
    const missions = await user.$relatedQuery("missions")
    return res.status(200).json({ missions })
  } catch (err) {
    return res.status(500).json({ errors: err })
  }
})

missionsRouter.post("/:userId", async (req, res) => {
  const { userId } = req.params
  try {
    const missionBody = cleanMissionForm(req.body)
    let newMission
    if (missionBody.notes) {
    newMission = await Mission.query().insertAndFetch({ userId: userId, notes: missionBody.notes })
    } else {
    newMission = await Mission.query().insertAndFetch({ userId })
    }
    for (let i=0; i < missionBody.steps.length; i++) {
      const step = missionBody.steps[i]
      const newStep = {
        stepNumber: i+1,
        item: step.item,
        action: step.action,
        duration: step.duration,
        anxietyLevel: step.anxietyLevel
      }
      await newMission.$relatedQuery("steps").insert(newStep)
    }
    return res.status(201).json({ mission: newMission })
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(422).json({ errors: err.data })
    }
    return res.status(500).json({ errors: err })
  }
})

export default missionsRouter