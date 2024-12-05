import React, { useEffect, useState, useRef } from "react";
import styles from "./PopularStudy.module.css";
import "fonts/Font.css";

// image & icon
import cat from "assets/images/Home/1.jpg";
import member from "assets/icons/Home/member.png";
import circle from "assets/icons/Home/circle.png";

const PopularStudy = ({ study, onClick }) => {
  return (
    <div className={styles.study} onClick={onClick}>
      <img className={styles.studyImage} src={cat} alt="cat" />
      <div className={styles.studyDetail}>
        <p className={styles.studyName}>{study.title}</p>
        <p className={styles.studyContent}>
          {study.description.split("\n")[0]}
        </p>
        <div className={styles.studyMemberHow}>
          <img className={styles.studyMemberIcon} src={member} alt="member" />
          <span className={styles.studyMember}>{study.maxmembers}</span>
          <img className={styles.studyCircleIcon} src={circle} alt="circle" />
          <span className={styles.studyHow}>{study.proceed}</span>
        </div>
      </div>
    </div>
  );
};
export default PopularStudy;
