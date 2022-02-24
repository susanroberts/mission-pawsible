import React, { useState, useEffect} from "react"
import { Chart } from "react-google-charts"

const DurationGraph = props => {
  const [durations, setDurations] = useState([["Date", "Duration (minutes)"]])

  const getDuration = async () => {
    try {
      const response = await fetch(`/api/v1/${props.user.id}/missions/duration`)
      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`
        const error = new Error(errorMessage)
        throw (error)
      }
      const body = await response.json()
      const rows = body.missionDuration.map(mission => {
        const date = new Date(mission.createdAt)
        console.log(date)
        return [date, mission.duration]
      })
      setDurations(durations.concat(rows))
    } catch (err) {
      console.error("Error in fetch", err)
    }
  }
  
  const options = {
    legend: "none",
    hAxis: { title: "Date" },
    vAxis: { title: "Duration (minutes)" },
    trendlines: { 0: { type: "exponential", color: "#B49CE7" } },
    colors: ["#7180B9"],
    backgroundColor: "#FFFFF0"
  }

  useEffect(() => {
    getDuration()
  }, [])

  if (durations.length < 4) {
    return <h4 className="centered">Complete more missions to view training progress</h4>
  }

  return (
    <>
    <h4 className="centered">Training Progress</h4>
    <div className="chart">
      <Chart
        chartType="ScatterChart"
        data={durations}
        options={options}
      />
    </div>
    </>
  )
}

export default DurationGraph