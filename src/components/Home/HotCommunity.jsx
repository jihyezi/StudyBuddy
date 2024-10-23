import React, { useEffect } from "react";
import styles from "./HotCommunity.module.css";
import "fonts/Font.css";

// image & icon
import bookmark from "assets/icons/Home/bookmark.png";
import art from "assets/icons/Home/palette.png";
import CommunityField from "components/Communities/CommunityField";

const HotCommunity = ({ small, community, communityData, onClick, allcommunity }) => {
  useEffect(() => {
    console.log("community", community);
    console.log("communityDataa", communityData);
  }, []);

  return (
    <div
      className={`${styles.community} ${small ? styles.smallCommunity : ""}`}
      onClick={onClick}
    >
      <div
        className={`${styles.classificationIcon} ${small ? styles.smallclassificationIcon : ""
          }`}
      >
        <img className={styles.bookmarkIcon} src={bookmark} alt="bookmark" />
        <CommunityField field={communityData?.field} />
        {/* <img className={styles.artIcon} src={art} alt="art" /> */}
      </div>
      <p
        className={`${styles.communityName} ${small ? styles.smallCommunityName : ""
          }`}
      >
        {communityData?.name}
      </p>
      <p className={styles.communityDetail}>
        <span
          className={`${styles.communityDetailTitle} ${small ? styles.smallCommunityDetailTitle : ""
            }`}
        >
          인원
        </span>
        <span
          className={`${styles.communityDetailContent} ${small ? styles.smallCommunityDetailContent : ""
            }`}
        >
          {community?.member_count}명
        </span>
      </p>
      <p className={styles.communityDetail}>
        <span
          className={`${styles.communityDetailTitle} ${small ? styles.smallCommunityDetailTitle : ""
            }`}
        >
          게시글
        </span>
        <span
          className={`${styles.communityDetailContent} ${small ? styles.smallCommunityDetailContent : ""
            }`}
        >
          {communityData?.postCount}개
        </span>
      </p>
      <p className={styles.communityDetail}>
        <span
          className={`${styles.communityDetailTitle} ${small ? styles.smallCommunityDetailTitle : ""
            }`}
        >
          시작일
        </span>
        <span
          className={`${styles.communityDetailContent} ${small ? styles.smallCommunityDetailContent : ""
            }`}
        >
          {new Date(communityData?.createdat).toLocaleDateString()}
        </span>
      </p>
    </div>
  );
};

export default HotCommunity;
