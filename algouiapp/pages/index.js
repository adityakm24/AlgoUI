import styles from "../styles/sidepanelmenu.module.css";
import { useState } from "react";
import HomePage from './HomePage'
import SJF from './SJF'
import PS from './PS'
import RS from './RS'
import Bnk from './Bnk'


// Side panel menu component
function SidePanelMenu({ onMenuSelect, selectedMenu }) {
  return (
    <div className={styles.sidePanelMenu}>
      <ul className={styles.menuList}>
        <li
          className={`${styles.menuItem} ${
            selectedMenu === "home" ? styles.active : ""
          }`}
          onClick={() => onMenuSelect("home")}
        >
          Home
        </li>
        <li
          className={`${styles.menuItem} ${
            selectedMenu === "SJF" ? styles.active : ""
          }`}
          onClick={() => onMenuSelect("SJF")}
        >
          Shortest Job First (SJF) Scheduling
        </li>
        <li
          className={`${styles.menuItem} ${
            selectedMenu === "PS" ? styles.active : ""
          }`}
          onClick={() => onMenuSelect("PS")}
        >
          Priority Scheduling
        </li>
        <li
          className={`${styles.menuItem} ${
            selectedMenu === "RRS" ? styles.active : ""
          }`}
          onClick={() => onMenuSelect("RRS")}
        >
          Multi-Level Feedback Queue (MLFQ) Scheduling
        </li>
        <li
          className={`${styles.menuItem} ${
            selectedMenu === "Bnk" ? styles.active : ""
          }`}
          onClick={() => onMenuSelect("Bnk")}
        >
          Banker's Algorithm
        </li>
      </ul>
    </div>
  );
}

// Content component
function Content({ selectedMenu }) {
  return (
    <div style={{ marginLeft: "250px", padding: "20px" }}>
      {selectedMenu === "home" && <HomePage />}
      {selectedMenu === "SJF" && <SJF />}
      {selectedMenu === "PS" && <PS />}
      {selectedMenu === "RRS" && <RS />}
      {selectedMenu === "Bnk" && <Bnk />}
    </div>
  );
}

// Page component that combines the side panel menu and content components
function Page() {
  const [selectedMenu, setSelectedMenu] = useState("home");

  return (
    <div>
      <SidePanelMenu onMenuSelect={setSelectedMenu} selectedMenu={selectedMenu} />
      <Content selectedMenu={selectedMenu} />
    </div>
  );
}
export default function Home() {
  return <Page />;
}
