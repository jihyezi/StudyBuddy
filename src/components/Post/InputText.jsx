import React, { useEffect, useState, useRef } from "react";
import styles from "./InputText.module.css";
import "fonts/Font.css";

const InputText = (props) => {
  return (
    <div className={styles.inputContainer}>
      <div className={styles.inputTitle}>{props.title}</div>
      <input
        className={styles.inputField}
        type="text"
        placeholder={props.placeholder}
      />
    </div>
  );
};
export default InputText;