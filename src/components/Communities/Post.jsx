import React from "react";
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

const Post = ({ post }) => {
  return (
    <div className={styles.post}>
      <div
        style={{ marginTop: "20px", marginBottom: "20px", marginRight: "20px" }}
      >
        <span className={styles.communityName}>{post.community}</span>
        <img className={styles.moreIcon} src={more} alt="more" />
      </div>

      <div className={styles.postDetail}>
        <div>
          <img className={styles.userProfile} src={profile} alt="profile" />
        </div>

        <div className={styles.postWriterContent}>
          <div className={styles.postWriter}>
            <span className={styles.postWriterNickName}>{post.writerNickname}</span>
            <span className={styles.postWriterID}>{post.writerId}</span>
            <span className={styles.postWriteDate}>{post.createdAt}</span>
          </div>
          <div className={styles.postContent}>
            <p className={styles.postTitle}>{post.title}</p>
            <p className={styles.postPeriod}>1. 준비기간 : {post.postPeriod}</p>
            <p className={styles.postResult}>2. 결과 : {post.postResult}</p>
          </div>
          <div className={styles.postETC}>
            <div className={styles.postComment}>
              <img className={styles.commentIcon} src={commentOff} alt="commentOff" />
              <span className={styles.commentNumber}>{post.commentCount}</span>
            </div>
            <div className={styles.postLike}>
              <img className={styles.likeIcon} src={likeOn} alt="likeOn" />
              <span className={styles.likeNumber}>{post.likeCount}</span>
            </div>
            <div>
              <img className={styles.viewIcon} src={view} alt="view" />
              <span className={styles.viewNumber}>{post.viewNumber}</span>
            </div>
            <div>
              <img className={styles.bookmarkIcon} src={bookmarkOn} alt="bookmarkOn" />
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
