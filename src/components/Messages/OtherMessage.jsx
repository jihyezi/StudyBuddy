import React from "react";
import styles from "./OtherMessage.module.css";

const OtherMessage = ({ message, last }) => {
  return (
    <div className={styles.otherMessageWrapper}>
      <div className={styles.messageRow}>
        <div className={styles.profileImage}></div>
        <div className={last ? styles.otherMessageLast : styles.otherMessage}>
          {message}
        </div>
      </div>
    </div>
  );
};

export default OtherMessage;
