import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./RulePage.module.css";
import supabase from "components/supabaseClient";

const RulePage = ({ ruleData = {} }) => {
  const { communityId } = useParams();

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
