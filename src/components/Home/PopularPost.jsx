import React from "react";
import styles from "./PopularPost.module.css";
import "fonts/Font.css";

//icons
import likeOff from "assets/icons/Home/like_off.png";
import commentOff from "assets/icons/Home/comment_off.png";
import bookmarkOff from "assets/icons/Home/bookmark_off.png";

const PopularPost = React.memo(
  ({
    small,
    postData,
    postLike = [],
    comment = [],
    communityName,
    onClick,
  }) => {

    return (
      <div
        className={`${styles.community} ${small ? styles.smallCommunity : ""}`}
        onClick={onClick}
      >
        <p
          className={`${styles.communityName} ${small ? styles.smallcommunityName : ""
            }`}
        >
          {communityName ? communityName : "0"}
        </p>
        <p
          className={`${styles.postTitle} ${small ? styles.smallpostTitle : ""
            }`}
        >
          {postData?.title}
        </p>
        <div
          className={`${styles.postETC} ${small ? styles.smallpostETC : ""}`}
        >
          <div className={styles.like}>
            <img className={styles.likeIcon} src={likeOff} alt="likeOff" />
            <span className={styles.likeNumber}>
              {postLike ? postLike : "0"}
            </span>
          </div>
          <div className={styles.comment}>
            <img
              className={styles.commentIcon}
              src={commentOff}
              alt="commentOff"
            />
            <span className={styles.commentNumber}>
              {comment ? comment : "0"}
            </span>
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
  }
);
export default PopularPost;
