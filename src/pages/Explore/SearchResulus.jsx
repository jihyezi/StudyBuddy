import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./SearchResulus.module.css";

import JoinPostList from "components/Communities/CommunityJoinPostList";
import { dummyPostData } from "components/Dummydata";
import CommunityPostSmall from "components/Communities/CommunityPostSmall";
import CommunityPostList from "components/Communities/CommunityJoinPostList";

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

  const [currentTab, clickTab] = useState(0);

  const menuArr = [
    {
      name: "커뮤니티",
      content: <JoinPostList postData={dummyPostData} />,
      data: dummyPostData, // 데이터를 추가하여 비어있는지 확인 가능
    },
    {
      name: "전체글",
      content: <JoinPostList postData={dummyPostData} />,
      data: dummyPostData,
    },
    {
      name: "스터디",
      content: <JoinPostList postData={dummyPostData} />,
      data: dummyPostData,
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

      {/* 선택된 탭의 데이터가 존재하는지 확인하고 없으면 "검색 결과가 없습니다." 표시 */}
      {menuArr[currentTab].data && menuArr[currentTab].data.length > 0 ? (
        <div className={styles.desc}>{menuArr[currentTab].content}</div>
      ) : (
        <div className={styles.Nosearchresults}>검색 결과가 없습니다.</div>
      )}
    </div>
  );
};

export default SearchResults;
