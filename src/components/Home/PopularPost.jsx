import React, { useEffect, useState, useRef } from "react";
import styles from "./PopularPost.module.css";
import "fonts/Font.css";
// className={`${styles.community} ${small ? styles.smallCommunity : ""}`}
//icons
import likeOff from "assets/icons/Home/like_off.png";
import commentOff from "assets/icons/Home/comment_off.png";
import bookmarkOff from "assets/icons/Home/bookmark_off.png";

const PopularPost = ({ small }) => {
  return (
    <div className={`${styles.community} ${small ? styles.smallCommunity : ""}`}>
      <p className={`${styles.communityName} ${small ? styles.smallcommunityName : ""}`}>시각디자인기사</p>
      <p className={`${styles.postTitle} ${small ? styles.smallpostTitle : ""}`}>
        시각디자인기사 2주만에 합격할 수 있는 방법😆시각디자인기사 2주만에
        합격할 수 있는 방법😆
      </p>
      <div className={`${styles.postETC} ${small ? styles.smallpostETC : ""}`}>
        <div className={styles.like}>
          <img className={styles.likeIcon} src={likeOff} alt="likeOff" />
          <span className={styles.likeNumber}>123</span>
        </div>
        <div className={styles.comment}>
          <img
            className={styles.commentIcon}
            src={commentOff}
            alt="commentOff"
          />
          <span className={styles.commentNumber}>123</span>
        </div>
        <div className={styles.bookmark}>
          <img
            className={styles.bookmarkIcon}
            src={bookmarkOff}
            alt="bookmarkOff"
          />
        </div>
      </div>
    </div>
  );
};
export default PopularPost;
