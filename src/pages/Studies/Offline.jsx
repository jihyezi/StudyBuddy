import React from "react";
import styles from './Offline.module.css'

// images
import commingsoon from "assets/images/commingsoon.gif"

const Offline = () => {
  return (
    <div className={styles.OfflineContainer}>
      <img src={commingsoon} className={styles.commingsoonicon} />
    </div>
  );
};

export default Offline;
