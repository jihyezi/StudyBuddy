import React, { useEffect, useState, useRef } from "react";
import styles from "./HotCommunity.module.css";
import "fonts/Font.css";

// image & icon
import bookmark from "assets/icons/Home/bookmark.png";
import art from "assets/icons/Home/palette.png";

const HotCommunity = ({}) => {
  return (
    <div className={styles.community}>
      <div className={styles.classificationIcon}>
        <img className={styles.bookmarkIcon} src={bookmark} alt="bookmark" />
        <img className={styles.artIcon} src={art} alt="art" />
      </div>
      <p className={styles.communityName}>시각디자인기사</p>
      <p className={styles.communityDetail}>
        <span className={styles.communityDetailTitle}>인원</span>
        <span className={styles.communityDetailContent}>50명</span>
      </p>
      <p className={styles.communityDetail}>
        <span className={styles.communityDetailTitle}>게시글</span>
        <span className={styles.communityDetailContent}>100개</span>
      </p>
      <p className={styles.communityDetail}>
        <span className={styles.communityDetailTitle}>시작일</span>
        <span className={styles.communityDetailContent}>2023.07.18</span>
      </p>
    </div>
  );
};
export default HotCommunity;
