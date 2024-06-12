import React, { useEffect, useState, useRef } from "react";
import styles from "./RecentCommunity.module.css";
import "fonts/Font.css";

// image & icon
import cancel from "assets/icons/Home/cancel.png";
import cat from "assets/images/Home/1.jpg";
import group from "assets/icons/Home/group.png";

const RecentCommunity = ({}) => {
  return (
    <div className={styles.community}>
      <img className={styles.cancelIcon} src={cancel} alt="cancel" />
      <div className={styles.communityImageContainer}>
        <img className={styles.communityImage} src={cat} alt="cat" />
      </div>
      <p className={styles.communityName}>시각디자인기사</p>
      <p className={styles.communityDetailIntro}>
        시각디자인기사 합격을 위한 커뮤니티입니다!
      </p>
      <div className={styles.communityGroup}>
        <img className={styles.communityGroupIcon} src={group} alt="group" />
        <span className={styles.communityGroupNumber}>66,666</span>
      </div>
      <div className={styles.join}>Join</div>
    </div>
  );
};
export default RecentCommunity;
