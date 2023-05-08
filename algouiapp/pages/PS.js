import { useState } from "react";
import styles from "../styles/forms.module.css";

export default function PriorityScheduling() {
  const [processes, setProcesses] = useState([]);
  const [averageWaitingTime, setAverageWaitingTime] = useState(null);
  const [averageTurnaroundTime, setAverageTurnaroundTime] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    // parse user input for processes
    const processCount = parseInt(formData.get("process-count"));
    const processes = [];
    for (let i = 0; i < processCount; i++) {
      processes.push({
        arrivalTime: parseInt(formData.get(`arrival-time-${i}`)),
        burstTime: parseInt(formData.get(`burst-time-${i}`)),
        priority: parseInt(formData.get(`priority-${i}`)),
      });
    }
    setProcesses(processes);

    // calculate average waiting time and average turnaround time using Priority Scheduling algorithm
    const { averageWaitingTime, averageTurnaroundTime } =
      priorityScheduling(processes);
    setAverageWaitingTime(averageWaitingTime);
    setAverageTurnaroundTime(averageTurnaroundTime);
  }

  return (
    <div>
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
                <label className={styles.label} htmlFor={`arrival-time-${i}`}>
                  Arrival time of process(ms) {i + 1}:
                </label>
                <input
                  className={styles.input}
                  type="number"
                  name={`arrival-time-${i}`}
                  id={`arrival-time-${i}`}
                  min="0"
                  max="100"
                  required
                />
                <br />
                <label className={styles.label} htmlFor={`burst-time-${i}`}>
                  Burst time of process(ms) {i + 1}:
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
                <label className={styles.label} htmlFor={`priority-${i}`}>
                  Priority of process {i + 1}:
                </label>
                <input
                  className={styles.input}
                  type="number"
                  name={`priority-${i}`}
                  id={`priority-${i}`}
                  min="1"
                  max="10"
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
          <p>Average turnaround time: {averageTurnaroundTime.toFixed(2)} ms </p>
        </div>
      )}
    </div>
  );
}

function priorityScheduling(processes) {
  const n = processes.length;
  let waitingTime = 0;
  let turnaroundTime = 0;

  // sort processes by priority in ascending order
  processes.sort((a, b) => a.priority - b.priority);

  // calculate waiting time and turnaround time for each process
  let currentTime = 0;
  for (let i = 0; i < n; i++) {
    const process = processes[i];
    const waitingTime_i = Math.max(0, currentTime - process.arrivalTime);
    waitingTime += waitingTime_i;
    turnaroundTime += waitingTime_i + process.burstTime;
    currentTime += process.burstTime;
  }

  // calculate average waiting time and average turnaround time
  const averageWaitingTime = waitingTime / n;
  const averageTurnaroundTime = turnaroundTime / n;

  return { averageWaitingTime, averageTurnaroundTime };
}
