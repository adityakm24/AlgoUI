import Link from "next/link";
import styles from "../styles/forms.module.css";


export default function Home() {
  return (
    <div className={styles.about}>
      <div className={styles.abt}>
        <h1>Our Project</h1>
        <p>
          AlgoUI is a web application which is used to test various scheduling
          algorithms in the Minix OS. Users can input parameters such as process
          arrival time and burst time, as well as the quantum size, and see how
          each algorithm performs under different conditions.
        </p>
        <h3>contributors:</h3>
        <a href="https://github.com/adityakm24"> Aditya Krishnan M</a> / 
        <a href="https://github.com/team-member-1"> Hamza Shariff</a> /
        <a href="https://github.com/team-member-1"> Gokul SanghEEth</a> 
      </div>
    </div>
  );
}
