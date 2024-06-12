import React, { useEffect, useState, useRef } from "react";
import styles from "./Post.module.css";
import "fonts/Font.css";

// icon & image
import more from "assets/icons/Communities/more.png";
import profile from "assets/icons/Communities/profile.png";
import commentOff from "assets/icons/Communities/comment_off.png";
import commentOn from "assets/icons/Communities/comment_on.png";
import likeOff from "assets/icons/Communities/like_off.png";
import likeOn from "assets/icons/Communities/like_on.png";
import view from "assets/icons/Communities/view.png";
import bookmarkOff from "assets/icons/Communities/bookmark_off.png";
import bookmarkOn from "assets/icons/Communities/bookmark_on.png";
import share from "assets/icons/Communities/share.png";

const Post = ({}) => {
  return (
    <div className={styles.post}>
      <div
        style={{ marginTop: "20px", marginBottom: "20px", marginRight: "20px" }}
      >
        <span className={styles.communityName}>시각디자인기사</span>
        <img className={styles.moreIcon} src={more} alt="more" />
      </div>

      <div className={styles.postDetail}>
        <div>
          <img className={styles.userProfile} src={profile} alt="profile" />
        </div>

        <div className={styles.postWriterContent}>
          <div className={styles.postWriter}>
            <span className={styles.postWriterNickName}>이재완 / 울프</span>
            <span className={styles.postWriterID}>@wolfstagram96</span>
            <span className={styles.postWriteDate}>2023.02.04</span>
          </div>
          <div className={styles.postContent}>
            <p className={styles.postTitle}>
              [정보처리기사 2주만에 실기 합격할 수 있었던 방법😊]
            </p>
            <p className={styles.postPeriod}>1. 준비기간 : 2주</p>
            <p className={styles.postResult}>2. 결과 : 합격</p>
          </div>
          <div className={styles.postETC}>
            <div className={styles.postComment}>
              <img
                className={styles.commentIcon}
                src={commentOff}
                alt="commentOff"
              />
              <span className={styles.commentNumber}>123</span>
            </div>
            <div className={styles.postLike}>
              <img className={styles.likeIcon} src={likeOn} alt="likeOn" />
              <span className={styles.likeNumber}>123</span>
            </div>
            <div>
              <img className={styles.viewIcon} src={view} alt="view" />
              <span className={styles.viewNumber}>123</span>
            </div>
            <div>
              <img
                className={styles.bookmarkIcon}
                src={bookmarkOn}
                alt="bookmarkOn"
              />
            </div>
            <div>
              <img className={styles.shareIcon} src={share} alt="share" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Post;
