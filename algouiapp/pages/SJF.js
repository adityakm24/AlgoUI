import { useState, useEffect } from "react";
import styles from "../styles/forms.module.css";
import { Chart } from "react-google-charts";

export default function SJF() {
  const [processCount, setProcessCount] = useState(1);
  const [processes, setProcesses] = useState([]);
  const [averageWaitingTime, setAverageWaitingTime] = useState(null);
  const [averageTurnaroundTime, setAverageTurnaroundTime] = useState(null);
  const [ganttChartData, setGanttChartData] = useState([]);

  useEffect(() => {
    if (processes.length > 0) {
      const { averageWaitingTime, averageTurnaroundTime } =
        sjfScheduling(processes);
      setAverageWaitingTime(averageWaitingTime);
      setAverageTurnaroundTime(averageTurnaroundTime);

      const chartData = processes.map((process, index) => [
        `P${index + 1}`,
        null,
        null,
        process.burstTime,
      ]);
      setGanttChartData([["Task", "Start", "End", "Duration"], ...chartData]);
    }
  }, [processes]);

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const newProcesses = [];
    for (let i = 0; i < processCount; i++) {
      newProcesses.push({
        id: i + 1,
        burstTime: parseInt(formData.get(`burst-time-${i}`)),
      });
    }
    setProcesses(newProcesses);
  }

  function handleProcessCountChange(event) {
    setProcessCount(parseInt(event.target.value));
  }

  function sjfScheduling(processes) {
    const n = processes.length;
    let waitingTime = 0;
    let turnaroundTime = 0;

    processes.sort((a, b) => a.burstTime - b.burstTime);

    let currentTime = 0;
    for (let i = 0; i < n; i++) {
      processes[i].start = currentTime;
      processes[i].end = currentTime + processes[i].burstTime;

      let waitingTime_i = i === 0 ? 0 : currentTime;
      waitingTime += waitingTime_i;
      turnaroundTime += waitingTime_i + processes[i].burstTime;

      currentTime += processes[i].burstTime;
    }

    const averageWaitingTime = waitingTime / n;
    const averageTurnaroundTime = turnaroundTime / n;

    return { averageWaitingTime, averageTurnaroundTime };
  }

  return (
    <div>
      <h1 className={styles.heading}>Shortest Job First (SJF) Scheduling</h1>
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
              onChange={handleProcessCountChange}
            />
            {Array.from({ length: processCount }, (_, i) => (
              <div key={i}>
                <label className={styles.label} htmlFor={`burst-time-${i}`}>
                  Burst time{i + 1}:
                </label>
                <input
                  className={styles.input}
                  type="number"
                  name={`burst-time-${i}`}
                  id={`burst-time-${i}`}
                  min="1"
                  required
                />
              </div>
            ))}
            <input className={styles.button} type="submit" value="Submit" />
          </form>
        </div>
        {averageWaitingTime !== null && (
          <p>
            Average Waiting Time: {averageWaitingTime}
            <br />
            Average Turnaround Time: {averageTurnaroundTime}
          </p>
        )}
      </div>
      {ganttChartData.length > 1 && (
        <Chart
          width={"600px"}
          height={"400px"}
          chartType="Timeline"
          loader={<div>Loading Chart</div>}
          data={ganttChartData}
          options={{ showRowNumber: true }}
          rootProps={{ "data-testid": "1" }}
        />
      )}
    </div>
  );
}
