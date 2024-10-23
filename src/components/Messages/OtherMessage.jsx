import React from "react";
import styles from "./OtherMessage.module.css";

const OtherMessage = ({ message, last, profile }) => {
  console.log(profile)
  return (
    <div className={styles.otherMessageWrapper}>
      <div className={styles.messageRow}>
        {/* <div className={styles.profileImage}></div> */}
        <img src={profile} className={styles.profileImage} />
        <div className={last ? styles.otherMessageLast : styles.otherMessage}>
          {message}
        </div>
      </div>
    </div>
  );
};

export default OtherMessage;
