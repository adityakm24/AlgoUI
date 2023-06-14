import React, { useState } from "react";
import { Chart } from "react-google-charts";
import styles from "../styles/forms.module.css";

export default function PriorityScheduling() {
  const [processes, setProcesses] = useState([]);
  const [averageWaitingTime, setAverageWaitingTime] = useState(null);
  const [averageTurnaroundTime, setAverageTurnaroundTime] = useState(null);
  const [ganttChartData, setGanttChartData] = useState([]);

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const processCount = parseInt(formData.get("process-count"));
    const processes = [];
    for (let i = 0; i < processCount; i++) {
      processes.push({
        id: i + 1,
        label: `P${i + 1}`,
        start: 0,
        end: parseInt(formData.get(`burst-time-${i}`)),
      });
    }
    setProcesses(processes);

    const { averageWaitingTime, averageTurnaroundTime } =
      priorityScheduling(processes);
    setAverageWaitingTime(averageWaitingTime);
    setAverageTurnaroundTime(averageTurnaroundTime);

    const ganttData = processes.map((process) => [
      process.label,
      process.label,
      new Date(0, 0, 0, 0, 0, process.start),
      new Date(0, 0, 0, 0, 0, process.end),
      null,
      100,
    ]);
    setGanttChartData(ganttData);
  }

  function priorityScheduling(processes) {
    const n = processes.length;
    let waitingTime = 0;
    let turnaroundTime = 0;

    let currentTime = 0;
    for (let i = 0; i < n; i++) {
      const process = processes[i];
      process.start = currentTime;
      process.end = currentTime + process.end;
      const waitingTime_i = Math.max(0, currentTime);
      waitingTime += waitingTime_i;
      turnaroundTime += waitingTime_i + process.end;
      currentTime += process.end;
    }

    const averageWaitingTime = waitingTime / n;
    const averageTurnaroundTime = turnaroundTime / n;

    return { averageWaitingTime, averageTurnaroundTime };
  }

  return (
    <div>
      <h1 className={styles.heading}>Priority Scheduling</h1>
      <div className={styles.box}>
        <div className={styles.container}>
          <form onSubmit={handleSubmit}>
            <label className={styles.label} htmlFor="process-count">
              Number of processes:
            </label>
            <input
              className={styles.input}
              type="number"
              name="process-count"
              id="process-count"
              min="1"
              max="10"
              required
            />
            <br />
            {processes.map((process, i) => (
              <div key={i}>
                <label className={styles.label} htmlFor={`burst-time-${i}`}>
                  Burst time of process (ms) {i + 1}:
                </label>
                <input
                  className={styles.input}
                  type="number"
                  name={`burst-time-${i}`}
                  id={`burst-time-${i}`}
                  min="1"
                  max="100"
                  required
                />
                <br />
              </div>
            ))}
            <button className={styles.button} type="submit">
              Calculate
            </button>
          </form>
        </div>
      </div>
      {averageWaitingTime !== null && averageTurnaroundTime !== null && (
        <div className={styles.box}>
          <p>Average waiting time: {averageWaitingTime.toFixed(2)} ms</p>
          <p>Average turnaround time: {averageTurnaroundTime.toFixed(2)} ms</p>
          <div style={{ width: "100%", height: "400px" }}>
            {ganttChartData.length > 0 ? (
              <Chart
                chartType="Gantt"
                loader={<div>Loading Chart</div>}
                data={[
                  ["Task ID", "Task Name", "Start Time", "End Time", null, 100],
                  ...ganttChartData,
                ]}
                options={{
                  height: 400,
                  gantt: {
                    labelStyle: { fontName: "Arial", fontSize: 12 },
                  },
                }}
              />
            ) : (
              <div>No data available</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
