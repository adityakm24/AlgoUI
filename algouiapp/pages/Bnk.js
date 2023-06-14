import React, { useState } from "react";
import { Chart } from "react-google-charts";
import styles from "../styles/forms.module.css";

export default function BankersAlgorithm() {
  const [processes, setProcesses] = useState([]);
  const [availableResources, setAvailableResources] = useState([]);
  const [safeSequence, setSafeSequence] = useState([]);

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const processCount = parseInt(formData.get("process-count"));
    const resourceCount = parseInt(formData.get("resource-count"));

    const newProcesses = [];
    for (let i = 0; i < processCount; i++) {
      const allocatedResources = [];
      const maxResources = [];
      for (let j = 0; j < resourceCount; j++) {
        const allocated = parseInt(formData.get(`allocation-${i}-${j}`));
        const max = parseInt(formData.get(`max-${i}-${j}`));
        allocatedResources.push(allocated);
        maxResources.push(max);
      }
      newProcesses.push({
        id: i + 1,
        allocatedResources,
        maxResources,
      });
    }
    setProcesses(newProcesses);

    const newAvailableResources = [];
    for (let i = 0; i < resourceCount; i++) {
      const available = parseInt(formData.get(`available-${i}`));
      newAvailableResources.push(available);
    }
    setAvailableResources(newAvailableResources);

    const safeSeq = findSafeSequence(newProcesses, newAvailableResources);
    setSafeSequence(safeSeq);
  }

function findSafeSequence(processes, availableResources) {
  const processCount = processes.length;
  const resourceCount = availableResources.length;

  // Copy the available resources and processes to avoid modifying the original arrays
  const available = [...availableResources];
  const work = new Array(resourceCount).fill(0);
  const finish = new Array(processCount).fill(false);
  const safeSeq = [];

  // Calculate the need matrix
  const need = processes.map((process) => {
    return process.maxResources.map(
      (max, i) => max - process.allocatedResources[i]
    );
  });

  let count = 0;
  while (count < processCount) {
    let found = false;
    for (let i = 0; i < processCount; i++) {
      if (!finish[i]) {
        let j;
        for (j = 0; j < resourceCount; j++) {
          if (need[i][j] > available[j]) {
            break;
          }
        }

        if (j === resourceCount) {
          for (let k = 0; k < resourceCount; k++) {
            available[k] += processes[i].allocatedResources[k];
          }
          safeSeq.push(processes[i]);
          finish[i] = true;
          found = true;
          count++;
        }
      }
    }

    if (!found) {
      break;
    }
  }

  return count === processCount ? safeSeq : [];
}


  function generateGanttChartData(safeSeq) {
    const ganttChartData = [
      ["Task", "Start", "End"],
      ...safeSeq.map((process, index) => [`P${process.id}`, index, index + 1]),
    ];
    return ganttChartData;
  }

  return (
    <div>
      <h1 className={styles.heading}>Banker's Algorithm</h1>
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
            <label className={styles.label} htmlFor="resource-count">
              Number of resources:
            </label>
            <input
              className={styles.input}
              type="number"
              name="resource-count"
              id="resource-count"
              min="1"
              max="10"
              required
            />
            <br />
            {processes.map((process, i) => (
              <div key={i}>
                <h3>Process {i + 1}</h3>
                {process.allocatedResources.map((allocated, j) => (
                  <div key={j}>
                    <label
                      className={styles.label}
                      htmlFor={`allocation-${i}-${j}`}
                    >
                      Allocated Resources {j + 1}:
                    </label>
                    <input
                      className={styles.input}
                      type="number"
                      name={`allocation-${i}-${j}`}
                      id={`allocation-${i}-${j}`}
                      min="0"
                      max="100"
                      required
                    />
                    <br />
                    <label className={styles.label} htmlFor={`max-${i}-${j}`}>
                      Max Resources {j + 1}:
                    </label>
                    <input
                      className={styles.input}
                      type="number"
                      name={`max-${i}-${j}`}
                      id={`max-${i}-${j}`}
                      min="0"
                      max="100"
                      required
                    />
                    <br />
                  </div>
                ))}
              </div>
            ))}
            <h3>Available Resources</h3>
            {availableResources.map((available, i) => (
              <div key={i}>
                <label className={styles.label} htmlFor={`available-${i}`}>
                  Available Resources {i + 1}:
                </label>
                <input
                  className={styles.input}
                  type="number"
                  name={`available-${i}`}
                  id={`available-${i}`}
                  min="0"
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
      {safeSequence.length > 0 && (
        <div className={styles.box}>
          <h3>Safety Sequence:</h3>
          <p>{safeSequence.map((process) => `P${process.id}`).join(" -> ")}</p>
        </div>
      )}
      {safeSequence.length > 0 && (
        <div className={styles.box}>
          <h3>Gantt Chart:</h3>
          <Chart
            width={"100%"}
            height={"400px"}
            chartType="Timeline"
            loader={<div>Loading Chart</div>}
            data={generateGanttChartData(safeSequence)}
            options={{
              timeline: {
                showRowLabels: false,
              },
            }}
          />
        </div>
      )}
    </div>
  );
}
