import React from "react";
import styles from "./Recommended.module.css";
import "fonts/Font.css";

// component
import HotCommunity from "components/Home/HotCommunity";
import PopularPost from "components/Home/PopularPost";

const Recommended = ({ }) => {
  return (
    <div className={styles.recommendedContainer}>
      <div className={styles.recommendedHead}>회원님을 위한 추천👍🏻</div>
      <div className={styles.recommended}>
        <div className={styles.recommendedPosts}>
          <HotCommunity />
          <PopularPost />
          <PopularPost />
        </div>
      </div>
    </div>
  );
};

export default Recommended;
