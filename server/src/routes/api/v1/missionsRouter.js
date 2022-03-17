import express from "express"
import { ValidationError } from "objection"

import cleanMissionForm from "../../../services/cleanMissionForm.js"
import { User, Mission, MissionStep } from "../../../models/index.js"
import MissionSerializer from "../../../serializers/MissionSerializer.js"

const missionsRouter = new express.Router({ mergeParams: true })

missionsRouter.get("/", async (req, res) => {
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

missionsRouter.get("/recent", async (req, res) => {
  const { userId } = req.params
  try {
    const thisWeek = await MissionSerializer.getThisWeek(userId)
    const lastWeek = await MissionSerializer.getLastWeek(userId)
    return res.status(200).json({ thisWeek, lastWeek })
  } catch (err) {
    return res.status(500).json({ errors: err })
  }
})

missionsRouter.get("/duration", async (req, res) => {
  const { userId } = req.params
  try {
    const missionDuration = await MissionSerializer.getDurations(userId)
    return res.status(200).json({ missionDuration })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ errors: err })
  }
})

missionsRouter.get("/:missionId", async (req, res) => {
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

missionsRouter.post("/", async (req, res) => {
  const { userId } = req.params
  try {
    const missionBody = cleanMissionForm(req.body)
    let missionDate
    if (missionBody.date) {
      const date = missionBody.date.split("-")
      missionDate = new Date(date[0], date[1] - 1, date[2]).toISOString()
    } else {
      missionDate = new Date().toISOString()
    }
    const transactionReturn = await Mission.transaction(async trx => {
      let newMission = await Mission.query(trx).insertAndFetch({ userId: userId, sessionDate: missionDate, notes: missionBody.notes })
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

missionsRouter.put("/:missionId", async (req, res) => {
  const { missionId, userId } = req.params
  try {
    const updateRequest = cleanMissionForm(req.body)
    if (updateRequest.notes === undefined) {
      updateRequest.notes = null
    }
    if (updateRequest.sessionDate) {
      const sessionDate = updateRequest.sessionDate.split("-")
      updateRequest.sessionDate = new Date(sessionDate[0], sessionDate[1] - 1, sessionDate[2]).toISOString()
    }
    const transactionReturn = await Mission.transaction(async trx => {
      if (updateRequest.sessionDate === undefined) {
        await Mission.query(trx)
          .update({ notes: updateRequest.notes, userId: userId })
          .where("id", missionId)
      } else {
        await Mission.query(trx)
          .update({ notes: updateRequest.notes, sessionDate: updateRequest.sessionDate, userId: userId })
          .where("id", missionId)
      }
      for (const step of updateRequest.steps) {
        if (step.item === undefined) {
          step.item = null
        }
        await MissionStep.query(trx)
          .update(step)
          .where("id", step.id)
      }
      return true
    })
    return res.status(201).json({ mission: transactionReturn })
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(422).json({ errors: err.data })
    }
    return res.status(500).json({ errors: err })
  }
})

missionsRouter.delete("/:missionId", async (req, res) => {
  const { missionId } = req.params
  try {
    await MissionStep.query()
      .delete()
      .where("missionId", missionId)
    await Mission.query()
      .delete()
      .where("id", missionId)
    return res.status(201).json({ message: "Mission deleted" })
  } catch (err) {
    return res.status(500).json({ errors: err })
  }
})

export default missionsRouter