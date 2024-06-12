import React, { useEffect, useState, useRef } from "react";
import styles from "./JoinCommunity.module.css";
import "fonts/Font.css";

// image
import cat from "assets/images/Communities/1.jpg";

const JoinCommunity = ({}) => {
  return (
    <div className={styles.joinCommunity}>
      <div className={styles.communityImageContainer}>
        <img className={styles.communityImage} src={cat} alt="cat" />
      </div>
      <div className={styles.communityName}>시각디자인기사</div>
    </div>
  );
};
export default JoinCommunity;
