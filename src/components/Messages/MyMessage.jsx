import React from "react";
import styles from "./MyMessage.module.css";

const MyMessage = ({ message, last }) => {
  return (
    <div className={styles.myMessageWrapper}>
      <div className={last ? styles.myMessageLast : styles.myMessage}>
        {message}
      </div>
    </div>
  );
};

export default MyMessage;
