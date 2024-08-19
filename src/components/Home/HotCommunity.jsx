import React from "react";
import styles from "./HotCommunity.module.css";
import "fonts/Font.css";

// image & icon
import bookmark from "assets/icons/Home/bookmark.png";
import art from "assets/icons/Home/palette.png";

const HotCommunity = ({ small }) => {
  return (
    <div className={`${styles.community} ${small ? styles.smallCommunity : ""}`}>
      <div className={`${styles.classificationIcon} ${small ? styles.smallclassificationIcon : ""}`}>
        <img className={styles.bookmarkIcon} src={bookmark} alt="bookmark" />
        <img className={styles.artIcon} src={art} alt="art" />
      </div>
      <p className={`${styles.communityName} ${small ? styles.smallCommunityName : ""}`}>
        시각디자인기사
      </p>
      <p className={styles.communityDetail}>
        <span className={`${styles.communityDetailTitle} ${small ? styles.smallCommunityDetailTitle : ""}`}>
          인원
        </span>
        <span className={`${styles.communityDetailContent} ${small ? styles.smallCommunityDetailContent : ""}`}>
          50명
        </span>
      </p>
      <p className={styles.communityDetail}>
        <span className={`${styles.communityDetailTitle} ${small ? styles.smallCommunityDetailTitle : ""}`}>
          게시글
        </span>
        <span className={`${styles.communityDetailContent} ${small ? styles.smallCommunityDetailContent : ""}`}>
          100개
        </span>
      </p>
      <p className={styles.communityDetail}>
        <span className={`${styles.communityDetailTitle} ${small ? styles.smallCommunityDetailTitle : ""}`}>
          시작일
        </span>
        <span className={`${styles.communityDetailContent} ${small ? styles.smallCommunityDetailContent : ""}`}>
          2023.07.18
        </span>
      </p>
    </div>
  );
};

export default HotCommunity;
