import React, { useEffect, useState, useRef } from "react";
import styles from "./CommunityDetailClick.module.css";
import "fonts/Font.css";

const CommunityDetailClick = ({}) => {
  return (
    <div className={styles.communityDetailClick}>
      <div className={styles.communityTab}>
        <span className={styles.communityPopularPost}>인기</span>
        <div className={styles.communityTabClick} />
      </div>
      <div className={styles.communityTab}>
        <span className={styles.communityRecentPost}>최근</span>
        <div className={styles.communityTabClick} />
      </div>
      <div className={styles.communityTab}>
        <span className={styles.communityRule}>규칙</span>
      </div>
      <div className={styles.communityTab}>
        <span className={styles.communityMember}>멤버</span>
      </div>
    </div>
  );
};
export default CommunityDetailClick;
