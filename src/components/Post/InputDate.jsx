import React, { useEffect, useState, useRef } from "react";
import styles from "./InputDate.module.css";
import "fonts/Font.css";

// icon
import down from "assets/icons/Post/down.png";

const InputDate = (props) => {
  const [selectedDate, setSelectedDate] = useState(props.placeholder);

  return (
    <div className={styles.inputContainer}>
      <div className={styles.inputTitle}>{props.title}</div>
      <div className={styles.inputClick}>
        <span className={styles.inputPlaceholder}>{selectedDate}</span>
        <img className={styles.inputIcon} src={down} alt="inputIcon" />
      </div>
    </div>
  );
};
export default InputDate;
