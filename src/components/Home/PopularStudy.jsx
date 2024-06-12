import React, { useEffect, useState, useRef } from "react";
import styles from "./PopularStudy.module.css";
import "fonts/Font.css";

// image & icon
import cat from "assets/images/Home/1.jpg";
import member from "assets/icons/Home/member.png";
import circle from "assets/icons/Home/circle.png";

const PopularStudy = ({}) => {
  return (
    <div className={styles.study}>
      <img className={styles.studyImage} src={cat} alt="cat" />
      <div className={styles.studyDetail}>
        <p className={styles.studyName}>시각디자인기사 오프라인 스터디</p>
        <p className={styles.studyContent}>
          시각디자인기사 오프라인 스터디입니다! 1주에 한번씩 모여서 스터디
          진행예정입니다!
        </p>
        <div className={styles.studyMemberHow}>
          <img className={styles.studyMemberIcon} src={member} alt="member" />
          <span className={styles.studyMember}>4명</span>
          <img className={styles.studyCircleIcon} src={circle} alt="circle" />
          <span className={styles.studyHow}>온라인</span>
        </div>
      </div>
    </div>
  );
};
export default PopularStudy;
