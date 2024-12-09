import React from "react";
import styles from "./OtherMessage.module.css";

const OtherMessage = ({ message, last, profile }) => {
  return (
    <div className={styles.otherMessageWrapper}>
      <div className={styles.messageRow}>
        <img src={profile} className={styles.profileImage} />
        <div className={last ? styles.otherMessageLast : styles.otherMessage}>
          {message}
        </div>
      </div>
    </div>
  );
};

export default OtherMessage;
