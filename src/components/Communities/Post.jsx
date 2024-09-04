import React, { useEffect, useState } from "react";
import styles from "./Post.module.css";
import { useNavigate } from "react-router-dom";

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

const Post = ({ post = {}, community = [], user = [], comment = [] }) => {
  const navigate = useNavigate();

  function formatDate(date) {
    try {
      const validDate = new Date(date);
      return validDate.toISOString();
    } catch (error) {
      console.error("formatDate에 전달된 잘못된 날짜:", date);
      return "잘못된 날짜";
    }
  }

  const startdate = formatDate(post.startdate);
  const enddate = formatDate(post.enddate);

  const calculateDaysBetween = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end - start;
    const dayDiff = timeDiff / (1000 * 3600 * 24);
    return Math.ceil(dayDiff);
  };

  const days = calculateDaysBetween(startdate, enddate);

  const communityName = Array.isArray(community)
    ? community.find((comm) => comm.communityid === post.communityid)?.name
    : "Unknown Community";

  const userimg = Array.isArray(user)
    ? user.find((u) => u.userid === post.userid)?.profileimage
    : "Unknown User";

  const userNickname = Array.isArray(user)
    ? user.find((u) => u.userid === post.userid)?.nickname
    : "Unknown User";

  const userName = Array.isArray(user)
    ? user.find((u) => u.userid === post.userid)?.username
    : "Unknown User";

  const commentCount = Array.isArray(comment)
    ? comment.filter((c) => c.postid === post.postid).length
    : 0;

  const handleClick = () => {
    navigate(`/detailpost`, {
      state: {
        postid: post.postid,
        communityid: post.communityid,
        title: post.title,
        content: post.content,
        createdat: post.createdat,
        updatedat: post.updatedat,
        startdate: post.startdate,
        enddate: post.enddate,
        book: post.book,
        result: post.result,
        references: post.references,
        userimg: userimg,
        userid: post.createdby,
        username: userName,
        usernickname: userNickname,
        day: days,
      },
    });
  };

  return (
    <div className={styles.post} onClick={handleClick}>
      <div
        style={{ marginTop: "20px", marginBottom: "20px", marginRight: "20px" }}
      >
        <span className={styles.communityName}>{communityName}</span>
        <img className={styles.moreIcon} src={more} alt="more" />
      </div>

      <div className={styles.postDetail}>
        <div>
          <img className={styles.userProfile} src={userimg} alt="profile" />
        </div>

        <div className={styles.postWriterContent}>
          <div className={styles.postWriter}>
            <span className={styles.postWriterNickName}>{userNickname}</span>
            <span className={styles.postWriterID}>@{userName}</span>
            <span className={styles.postWriteDate}>{post.createdAt}</span>
          </div>
          <div className={styles.postContent}>
            <p className={styles.postTitle}>[{post.title}]</p>
            <p className={styles.postPeriod}>
              1. 준비기간 : {new Date(post.startdate).toLocaleDateString()} ~{" "}
              {new Date(post.enddate).toLocaleDateString()} ({days}일)
            </p>
            <p className={styles.postResult}>2. 결과 : {post.result}</p>
          </div>
          <div className={styles.postETC}>
            <div className={styles.postComment}>
              <img
                className={styles.commentIcon}
                src={commentOff}
                alt="commentOff"
              />
              <span className={styles.commentNumber}>{commentCount}</span>
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
