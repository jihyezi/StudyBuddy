import React, { useEffect, useState, useRef } from "react";
import styles from "./InputModal.module.css";
import "fonts/Font.css";

const InputModal = (props) => {
  const [selectedModal, setSelectedModal] = useState(props.placeholder);

  return (
    <div className={styles.inputContainer}>
      <div className={styles.inputTitle}>{props.title}</div>
      <div className={styles.inputClick}>
        <span className={styles.inputPlaceholder}>{selectedModal}</span>
      </div>
    </div>
  );
};
export default InputModal;
