import React from "react";
import styles from "./CommunityPostSmall.module.css";
import imgbackground from "assets/images/bookmarkbackground.png";
import { useNavigate } from "react-router-dom";
import CommunityField from "./CommunityField";

const CommunityPostSmall = (props) => {
  const navigate = useNavigate(); // 페이지 이동을 위한 훅 사용

  const handleClick = () => {
    navigate(`/detail-community/${props.communityId}`); // 클릭 시 경로 이동
  };

  return (
    <div className={styles.communityPostContainer} onClick={handleClick}>
      <div className={styles.communityPostLeft}>
        <img
          src={props.communityimg}
          className={styles.communityPostImage}
          alt={props.communityname}
        />
        <div className={styles.communityPostDetails}>
          <div className={styles.communityPostTitle}>{props.communityname}</div>
          <div className={styles.communityPostInfo}>
            <div className={styles.communityPostInfoRow}>
              <span className={styles.communityPostInfoLabel}>인원</span>
              <span className={styles.communityPostInfoValue}>
                {props.person}명
              </span>
            </div>
            <div className={styles.communityPostInfoRow}>
              <span className={styles.communityPostInfoLabel}>게시글</span>
              <span className={styles.communityPostInfoValue}>
                {props.post}개
              </span>
            </div>
            <div className={styles.communityPostInfoRow}>
              <span className={styles.communityPostInfoLabel}>시작일</span>
              <span className={styles.communityPostInfoValue}>
                {props.date}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.communityPostIconWrapper}>
        <img
          src={imgbackground}
          className={styles.communityPostIconBackground}
          alt="Background"
        />
        {/* <img
          src={props.commmunityicon}
          className={styles.communityPostIconPalette}
          alt="Icon"
        /> */}
        <CommunityField field={props?.field} />
      </div>
    </div>
  );
};

export default CommunityPostSmall;
