import React, { useEffect, useState } from "react";
import supabase from "./../supabaseClient"; // Supabase 클라이언트 가져오기
import styles from "./HotCommunity.module.css";

// 이미지 및 아이콘
import bookmark from "assets/icons/Home/bookmark.png";
import art from "assets/icons/Home/palette.png";

const HotCommunity_test = ({ communities: propsCommunities, small }) => {
  const [communities, setCommunities] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommunities = async () => {
      const { data, error } = await supabase
        .from("hot_communities_view")
        .select("*");

      if (error) {
        console.error("Error fetching communities:", error);
      } else {
        const topCommunities = data
          .sort((a, b) => b.member_count - a.member_count)
          .slice(0, 3);
        setCommunities(topCommunities);
      }
    };

    fetchCommunities();
  }, []);

  return (
    <div className={styles.hotCommunityList}>
      {communities.map((community) => (
        <div
          key={community.communityid}
          className={`${styles.community} ${
            small ? styles.smallCommunity : ""
          }`}
        >
          <div
            className={`${styles.classificationIcon} ${
              small ? styles.smallclassificationIcon : ""
            }`}
          >
            <img
              className={styles.bookmarkIcon}
              src={bookmark}
              alt="bookmark"
            />
            <img className={styles.artIcon} src={art} alt="art" />
          </div>
          <p
            className={`${styles.communityName} ${
              small ? styles.smallCommunityName : ""
            }`}
          >
            {community.community_name} {/* 커뮤니티 이름 */}
          </p>
          <p className={styles.communityDetail}>
            <span
              className={`${styles.communityDetailTitle} ${
                small ? styles.smallCommunityDetailTitle : ""
              }`}
            >
              인원
            </span>
            <span
              className={`${styles.communityDetailContent} ${
                small ? styles.smallCommunityDetailContent : ""
              }`}
            >
              {community.member_count}명 {/* 커뮤니티 인원 */}
            </span>
          </p>
          <p className={styles.communityDetail}>
            <span
              className={`${styles.communityDetailTitle} ${
                small ? styles.smallCommunityDetailTitle : ""
              }`}
            >
              게시글
            </span>
            <span
              className={`${styles.communityDetailContent} ${
                small ? styles.smallCommunityDetailContent : ""
              }`}
            >
              {community.post_count}개 {/* 게시글 수 */}
            </span>
          </p>
          <p className={styles.communityDetail}>
            <span
              className={`${styles.communityDetailTitle} ${
                small ? styles.smallCommunityDetailTitle : ""
              }`}
            >
              시작일
            </span>
            <span
              className={`${styles.communityDetailContent} ${
                small ? styles.smallCommunityDetailContent : ""
              }`}
            >
              {new Date(community.start_date).toLocaleDateString()}{" "}
              {/* 시작일 */}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
};

export default HotCommunity_test;
