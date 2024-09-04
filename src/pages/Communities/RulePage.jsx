import React from "react";
import styles from "./RulePage.module.css";

const RulePage = ({ communityInfo }) => {

    const rules = Array.isArray(communityInfo.rules) ? communityInfo.rules : [];

    return (
        <div className={styles.container}>
            <div className={styles.title}>Rule</div>
            <div className={styles.ruleList}>
                {rules.map((rule, index) => (
                    <div key={index} className={styles.ruleItem}>
                        <div className={styles.circle}>{index + 1}</div>
                        <div className={styles.ruleText}>{rule.text}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RulePage;
