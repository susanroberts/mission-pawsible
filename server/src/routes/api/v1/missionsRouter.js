import express from "express"
import { ValidationError } from "objection"

import cleanMissionForm from "../../../services/cleanMissionForm.js"
import { User, Mission } from "../../../models/index.js"
import MissionSerializer from "../../../serializers/MissionSerializer.js"

const missionsRouter = new express.Router({ mergeParams: true})

missionsRouter.get("/missions", async (req, res) => {
  const { userId } = req.params
  try {
    const user = await User.query().findById(userId)
    const missions = await user.$relatedQuery("missions")
    const serializedMissions = MissionSerializer.getSummary(missions)
    return res.status(200).json({ missions: serializedMissions })
  } catch (err) {
    return res.status(500).json({ errors: err })
  }
})

missionsRouter.get("/missions/recent", async (req, res) => {
  const { userId } = req.params
  try {
    const thisWeek = await MissionSerializer.getThisWeek(userId)
    const lastWeek = await MissionSerializer.getLastWeek(userId)
    return res.status(200).json({ thisWeek, lastWeek })
  } catch (err) {
    return res.status(500).json({ errors: err })
  }
})

missionsRouter.get("/missions/duration", async (req, res) => {
  const { userId } = req.params
  try {
    const missionDuration = await MissionSerializer.getDurations(userId)
    return res.status(200).json({ missionDuration })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ errors: err })
  }
})

missionsRouter.get("/missions/:missionId", async (req, res) => {
  const { userId, missionId } = req.params
  try {
    const mission = await Mission.query().findById(missionId)
    if (mission.userId === userId) {
      const serializedMission = await MissionSerializer.getDetails(mission)
      return res.status(200).json({ mission: serializedMission })
    } else {
      return res.status(401).json({ error: "unauthorized"})
    }
  } catch (err) {
    return res.status(500).json({ errors: err })
  }
})

missionsRouter.post("/missions", async (req, res) => {
  const { userId } = req.params
  try {
    const missionBody = cleanMissionForm(req.body)
    const transactionReturn = await Mission.transaction(async trx => {
      let newMission = await Mission.query(trx).insertAndFetch({ userId: userId, notes: missionBody.notes })
      for (let i=0; i < missionBody.steps.length; i++) {
        const step = missionBody.steps[i]
        const newStep = {
          stepNumber: i+1,
          item: step.item,
          action: step.action,
          duration: step.duration,
          anxietyLevel: step.anxietyLevel
        }
        await newMission.$relatedQuery("steps", trx).insert(newStep)
      }
      return newMission
    })
    return res.status(201).json({ mission: transactionReturn })
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(422).json({ errors: err.data })
    }
    return res.status(500).json({ errors: err })
  }
})

export default missionsRouter