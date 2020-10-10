import React from "react";
import styles from "./App.module.scss";
import DatasetExplorer from "./DatasetExplorer";

function App() {
  return (
    <div className={styles.App}>
      <header className={styles["App-header"]}>
        <h1>Health Equity Tracker Frontend</h1>
      </header>
      <DatasetExplorer></DatasetExplorer>
    </div>
  );
}

export default App;
