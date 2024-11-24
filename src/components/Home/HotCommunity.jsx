import React from "react";
import styles from "./HotCommunity.module.css";
import "fonts/Font.css";

// image & icon
import bookmark from "assets/icons/Home/bookmark.png";
import CommunityField from "components/Communities/CommunityField";

const HotCommunity = React.memo(
  ({ small, community, communityData, onClick }) => {

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
  }
);

export default HotCommunity;
