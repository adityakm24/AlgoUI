import { useState } from 'react';
import styles from "../styles/forms.module.css";

export default function SJF() {
  const [processes, setProcesses] = useState([]);
  const [averageWaitingTime, setAverageWaitingTime] = useState(null);
  const [averageTurnaroundTime, setAverageTurnaroundTime] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    // parse user input for processes
    const processCount = parseInt(formData.get('process-count'));
    const processes = [];
    for (let i = 0; i < processCount; i++) {
      processes.push({
        arrivalTime: parseInt(formData.get(`arrival-time-${i}`)),
        burstTime: parseInt(formData.get(`burst-time-${i}`))
      });
    }
    setProcesses(processes);

    // calculate average waiting time and average turnaround time using SJF algorithm
    const { averageWaitingTime, averageTurnaroundTime } = sjfScheduling(processes);
    setAverageWaitingTime(averageWaitingTime);
    setAverageTurnaroundTime(averageTurnaroundTime);
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
              </div>
            ))}
            <button className={styles.button} type="submit">
              Calculate
            </button>
          </form>
        </div>
      </div>
      <br></br>

      {averageWaitingTime !== null && averageTurnaroundTime !== null && (
        <div className={styles.box}>
          <p>Average waiting time: {averageWaitingTime.toFixed(2)} ms</p>
          <p>Average turnaround time: {averageTurnaroundTime.toFixed(2)} ms</p>
        </div>
      )}
    </div>
  );
}

function sjfScheduling(processes) {
  const n = processes.length;
  let waitingTime = 0;
  let turnaroundTime = 0;

  // sort processes by burst time in ascending order
  processes.sort((a, b) => a.burstTime - b.burstTime);

  // calculate waiting time and turnaround time for each process
  for (let i = 0; i < n; i++) {
    let waitingTime_i = i === 0 ? 0 : turnaroundTime - processes[i].arrivalTime;
    waitingTime += waitingTime_i;
    turnaroundTime += waitingTime_i + processes[i].burstTime;
  }

  // calculate average waiting time and average turnaround time
  const averageWaitingTime = waitingTime / n;
  const averageTurnaroundTime = turnaroundTime / n;

  return { averageWaitingTime, averageTurnaroundTime };
}
