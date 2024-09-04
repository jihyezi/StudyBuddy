import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StudyPost.module.css";

import heart_off from "assets/icons/favorite_off.png";
import heart_on from "assets/icons/favorite_on.png";
import comment from "assets/icons/comment.png";
import share from "assets/icons/share.png";
import person from "assets/icons/person.png";

const StudyPost = (props) => {
  const navigate = useNavigate();

  const handlePostClick = () => {
    navigate(`/detail-study/${props.studyId}`);
  };

  return (
    <div className={styles.StudyPostContainer} onClick={handlePostClick}>
      <div className={styles.StudyPostWrapper}>
        <div className={styles.StudyPostTitleContainer}>
          {props.completion === "모집 중" ? (
            <div className={styles.StudyPostState}>모집 중</div>
          ) : (
            <div className={styles.StudyPostState2}>모집완료</div>
          )}
          <div className={styles.StudyPostTitle}>{props.title}</div>
        </div>
        <div className={styles.StudyPostDescription}>{props.description}</div>
        <div className={styles.StudyPostTags}>
          {props.tag.map((tag, index) => (
            <div key={index} className={styles.StudyPostTag}>
              {tag}
            </div>
          ))}
        </div>

        <div className={styles.StudyPostFooter}>
          <div className={styles.StudyPostIconGroup}>
            <div className={styles.StudyPostIcon}>
              <img src={person} alt="person" />
              <div style={{ color: "#606060", fontSize: 12, fontWeight: 500 }}>
                {props.maxmembers}
              </div>
            </div>
            <div
              style={{
                width: 2,
                height: 2,

                background: "#606060",
                borderRadius: 25,
              }}
            />
            <div style={{ color: "#606060", fontSize: 12, fontWeight: 500 }}>
              {props.proceed}
            </div>
          </div>
          <div className={styles.StudyPostIconGroup}>
            <div className={styles.StudyPostIcon}>
              <img src={heart_off} alt="heart_off" />
              <span>123</span>
            </div>
            <div className={styles.StudyPostIcon}>
              <img src={comment} alt="comment" />
              <span>123</span>
            </div>
            <div className={styles.StudyPostIcon}>
              <img src={share} alt="share" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPost;
