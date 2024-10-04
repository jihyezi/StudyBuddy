import React from "react";
import styles from './Offline.module.css'

// images
import comingsoon from "assets/images/comingsoon.gif"

const Offline = () => {
  return (
    <div className={styles.OfflineContainer}>
      <img src={comingsoon} className={styles.comingsoonicon} />
    </div>
  );
};

export default Offline;
