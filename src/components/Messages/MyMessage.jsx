import React, { useEffect, useState, useRef } from "react";
import styles from "./MyMessage.module.css";
import "fonts/Font.css";

const MyMessage = ({}) => {
  return (
    <>
      <div className={styles.myMessage}>MyMessage</div>
      <div className={styles.myMessageLast}>MyMessage</div>
    </>
  );
};
export default MyMessage;
