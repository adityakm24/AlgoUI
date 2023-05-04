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
          each algorithm performs under different conditions.The app is built
          using{" "}
          <a href="https://nextjs.org/" target="_blank">
            Next.js
          </a>
          , a popular React-based framework, and is designed to be responsive
          and easy to use.
        </p>
        <h3>Contributors:</h3>
        <a href="https://github.com/adityakm24"> Aditya Krishnan M</a> /
        <a href="https://github.com/team-member-1"> Hamza Shariff</a> /
        <a href="https://github.com/team-member-1"> Gokul Sangheeth</a>{" "}
        <br></br>
        <br></br>
        <br></br>
        <a href="https://github.com/adityakm24/AlgoUI">
          <p>View Code on GitHub</p>
        </a>
      </div>
    </div>
  );
}
