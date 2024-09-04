import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./RulePage.module.css";
import supabase from "components/supabaseClient";

const dummydata = [
  "정보보안기사 합격을 위한 커뮤니티입니다!",
  "자료 다운 시 좋아요 눌러주세요!",
  "악플 및 비방 글 작성 시 강제 퇴장❗❗",
  "광고 글은 삼가해주세요❗❗",
];

const RulePage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>Rule</div>
      <div className={styles.ruleList}>
        {dummydata.map((rule, index) => (
          <div key={index} className={styles.ruleItem}>
            <div className={styles.circle}>{index + 1}</div>
            <div className={styles.ruleText}>{rule}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RulePage;
