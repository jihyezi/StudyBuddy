import React, { useEffect, useState, useRef } from "react";
import styles from "./InputRule.module.css";
import "fonts/Font.css";

//icon
import add from "assets/icons/Post/add.png";
import cancel from "assets/icons/Post/close.png";

const InputRule = (props) => {
  return (
    <div>
      <div className={styles.inputContainer}>
        <div className={styles.inputTitle}>{props.title}</div>
        <div className={styles.addContainer}>
          <img className={styles.addIcon} src={add} alt="add" />
          <div className={styles.addText}>추가하기</div>
        </div>
      </div>
      <div className={styles.ruleContainer}>
        <div className={styles.ruleNumberContainer}>
          <div className={styles.ruleNumber}>1</div>
        </div>
        <div className={styles.ruleText}>
          존중하고 서로 배려하며 예의를 지켜요
        </div>
      </div>
      <div className={styles.ruleContainer}>
        <div className={styles.ruleNumberContainer}>
          <div className={styles.ruleNumber}>2</div>
        </div>
        <div className={styles.ruleText}>규칙을 입력해주세요.</div>
        <img className={styles.cancelIcon} src={cancel} alt="cancel" />
      </div>
    </div>
  );
};
export default InputRule;
