import React from "react";
import styles from "./RulePage.module.css";

const RulePage = ({ ruleData = {} }) => {

  return (
    <div className={styles.container}>
      <div className={styles.title}>Rule</div>
      <div className={styles.ruleList}>
        {ruleData &&
          ruleData[0].rules.map((rule) => (
            <div key={rule.id} className={styles.ruleItem}>
              <div className={styles.circle}>{rule.id}</div>
              <div className={styles.ruleText}>{rule.text}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RulePage;
