import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./SearchResulus.module.css";

import JoinPostList from "components/Communities/CommunityJoinPostList";
import CommunityPostSmall from "components/Communities/CommunityPostSmall";
import StudyPost from "components/Studies/StudyPost";

import useCommunities from "../../components/Explore/hooks/useCommunities";
import usePostsAndUsers from "../../components/Explore/hooks/usePostsAndUsers";
import useStudies from "../../components/Explore/hooks/useStudies";

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

  const [currentTab, clickTab] = useState(0);

  const communities = useCommunities(query);
  const { posts, users, communityInfo, commentData } = usePostsAndUsers(query);
  const { studies, likesCount, commentsCount } = useStudies(query);

  const menuArr = [
    {
      name: "커뮤니티",
      content: communities.map((community) => (
        <CommunityPostSmall
          key={community.communityid}
          communityimg={community.image}
          communityname={community.name}
          person={community.membercount}
          post={community.postcount}
          date={new Date(community.createdat).toLocaleDateString()}
          communityicon="icon_url_here"
        />
      )),
      data: communities,
    },
    {
      name: "전체글",
      content: (
        <JoinPostList
          postData={posts}
          communityData={communityInfo}
          userData={users}
          comment={commentData}
        />
      ),
      data: posts,
    },
    {
      name: "스터디",
      content:
        studies.length > 0 ? (
          studies.map((study) => (
            <StudyPost
              key={study.studyid}
              studyId={study.studyid}
              completion={study.completion}
              title={study.title}
              description={study.description.split("\n")[0]} // 첫 줄만 표시
              tag={study.tag}
              maxmembers={study.maxmembers}
              proceed={study.proceed}
              studyPost={study}
              likesCount={likesCount[study.studyid] || 0}
              commentsCount={commentsCount[study.studyid] || 0}
            />
          ))
        ) : (
          <div className={styles.Nosearchresults}>검색 결과가 없습니다.</div>
        ),
      data: studies,
    },
  ];

  const selectMenuHandler = (index) => {
    clickTab(index);
  };

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
      <div className={styles.communityPostSmallWrap}>
        {menuArr[currentTab].content}
      </div>
    </div>
  );
};

export default SearchResults;
