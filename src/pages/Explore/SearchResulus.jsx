import React, { useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./SearchResulus.module.css";

import JoinPostList from "components/Communities/CommunityJoinPostList";
import CommunityPostSmall from "components/Communities/CommunityPostSmall";
import StudyPost from "components/Studies/StudyPost";

import useCommunities from "../../components/Explore/hooks/useCommunities";
import usePostsAndUsers from "../../components/Explore/hooks/usePostsAndUsers";
import useStudies from "../../components/Explore/hooks/useStudies";
import { useAuth } from "contexts/AuthContext";

const SearchResults = () => {
  const { user } = useAuth();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

  const [currentTab, setCurrentTab] = useState(0);

  const communities = useCommunities(query);
  const {
    posts,
    users = {},
    communityInfo,
    allUserData,
    commentData,
  } = usePostsAndUsers(query);
  const { studies, likesCount, commentsCount } = useStudies(query);
  const loginUser = Object.values(users).filter((p) => p.userid === user.id);
  console.log("로그인", loginUser);
  useEffect(() => {
    console.log("유저 데이터:", users);
  }, [users]);

  const menuArr = [
    {
      name: "커뮤니티",
      content:
        communities.length > 0 ? (
          communities.map((community) => (
            <CommunityPostSmall
              key={community.communityid}
              communityId={community.communityid}
              communityimg={community.image}
              communityname={community.name}
              person={community.membercount}
              post={community.postcount}
              field={community.field} //////////////확인해봐야함
              date={new Date(community.createdat).toLocaleDateString()}
              field={community.field}
              communityicon="icon_url_here"
            />
          ))
        ) : (
          <div className={styles.Nosearchresults}>
            {" "}
            '{query}'에 대한 검색 결과가 없습니다.
          </div>
        ),
    },
    {
      name: "전체글",
      content:
        posts.length > 0 ? (
          <JoinPostList
            postData={posts}
            communityData={communityInfo}
            userData={loginUser}
            allUserData={allUserData} // now you can pass allUserData
            comment={commentData}
          />
        ) : (
          <div className={styles.Nosearchresults}>
            {" "}
            '{query}'에 대한 검색 결과가 없습니다.
          </div>
        ),
    },
    {
      name: "스터디",
      content:
        studies.length > 0 ? (
          studies.map((post, index) => <StudyPost key={index} study={post} />)
        ) : (
          <div className={styles.Nosearchresults}>
            {" "}
            '{query}'에 대한 검색 결과가 없습니다.
          </div>
        ),
    },
  ];

  const selectMenuHandler = useCallback((index) => {
    setCurrentTab(index);
  }, []);

  return (
    <div className={styles.SearchResults}>
      <div className={styles.communityDetailClick}>
        {menuArr.map((el, index) => (
          <div
            key={index}
            className={styles.communityTab}
            onClick={() => selectMenuHandler(index)}
          >
            <span
              className={
                index === currentTab
                  ? `${styles[`community${el.name}Post`]} ${styles.selected}`
                  : styles[`community${el.name}Post`]
              }
            >
              {el.name}
            </span>
            {index === currentTab && (
              <div className={styles.communityTabClick} />
            )}
          </div>
        ))}
      </div>
      <div
        className={
          menuArr.name === "커뮤니티"
            ? styles.communityPostSmallWrap
            : styles.communityPostSmallWrap2
        }
      >
        {menuArr[currentTab].content}
      </div>
    </div>
  );
};

export default SearchResults;
