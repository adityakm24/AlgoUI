import { useState } from "react";
import styles from "../styles/forms.module.css";


export default function RoundRobinScheduling() {
  const [processes, setProcesses] = useState([]);
  const [quantum, setQuantum] = useState(1);
  const [averageWaitingTime, setAverageWaitingTime] = useState(null);
  const [averageTurnaroundTime, setAverageTurnaroundTime] = useState(null);

  const handleAddProcess = (event) => {
    event.preventDefault();
    const id = processes.length + 1;
    const arrivalTime = parseInt(event.target.arrivalTime.value);
    const burstTime = parseInt(event.target.burstTime.value);
    const priority = parseInt(event.target.priority.value);
    setProcesses([...processes, { id, arrivalTime, burstTime, priority }]);
    event.target.reset();
  };

  const handleCalculate = () => {
    const n = processes.length;
    let waitingTime = Array(n).fill(0);
    let turnaroundTime = Array(n).fill(0);
    let remainingTime = processes.map((p) => p.burstTime);
    let currentTime = 0;
    let completedProcesses = 0;
    let queue = [];

    while (completedProcesses < n) {
      // add arriving processes to queue
      for (let i = 0; i < n; i++) {
        if (processes[i].arrivalTime <= currentTime && remainingTime[i] > 0) {
          queue.push(i);
        }
      }

      // process current job in queue
      if (queue.length > 0) {
        const i = queue[0];
        queue.shift();
        const time = Math.min(remainingTime[i], quantum);
        remainingTime[i] -= time;
        currentTime += time;
        for (let j = 0; j < n; j++) {
          if (
            j !== i &&
            remainingTime[j] > 0 &&
            processes[j].arrivalTime <= currentTime
          ) {
            queue.push(j);
          }
        }
        if (remainingTime[i] === 0) {
          completedProcesses++;
          waitingTime[i] =
            currentTime - processes[i].burstTime - processes[i].arrivalTime;
          turnaroundTime[i] = currentTime - processes[i].arrivalTime;
        } else {
          queue.push(i);
        }
      } else {
        currentTime++;
      }
    }

    const totalWaitingTime = waitingTime.reduce((sum, wt) => sum + wt, 0);
    const totalTurnaroundTime = turnaroundTime.reduce((sum, tt) => sum + tt, 0);
    setAverageWaitingTime(totalWaitingTime / n);
    setAverageTurnaroundTime(totalTurnaroundTime / n);
  };

  return (
    <div>
      <h1 className={styles.heading}>
        {" "}
        Multi-Level Feedback Queue (MLFQ) Scheduling
      </h1>
      <div className={styles.box}>
        <div className={styles.container}>
          <form onSubmit={handleAddProcess}>
            <label className={styles.label}>Arrival Time:</label>
            <input
              className={styles.input}
              type="number"
              name="arrivalTime"
              required
            />
            <label className={styles.label}>Burst Time:</label>
            <input
              className={styles.input}
              type="number"
              name="burstTime"
              required
            />
            <label className={styles.label}>Priority: </label>
            <input
              className={styles.input}
              type="number"
              name="priority"
              required
            />
            <button className={styles.add} type="submit">
              + Add Process
            </button>
          </form>
        </div>
      </div>
      <div className={styles.box}>
        <div className={styles.container}>
          <form onSubmit={(event) => event.preventDefault()}>
            <label className={styles.label}>Quantum: </label>
            <input
              className={styles.input}
              type="number"
              value={quantum}
              onChange={(event) => setQuantum(parseInt(event.target.value))}
              required
            />
            <button className={styles.button} onClick={handleCalculate}>
              Calculate
            </button>
          </form>
        </div>
      </div>
      {averageWaitingTime && averageTurnaroundTime && (
        <div className={styles.box}>
          <p>Average Waiting Time: {averageWaitingTime.toFixed(2)} ms</p>
          <p>Average Turnaround Time: {averageTurnaroundTime.toFixed(2)} ms</p>
        </div>
      )}
      <div className={styles.box}>
        <h2>Processes</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Arrival Time (ms)</th>
              <th>Burst Time(ms)</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((process) => (
              <tr key={process.id}>
                <td>{process.id}</td>
                <td>{process.arrivalTime}</td>
                <td>{process.burstTime}</td>
                <td>{process.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
