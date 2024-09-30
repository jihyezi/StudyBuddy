import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./SearchResulus.module.css";

import JoinPostList from "components/Communities/CommunityJoinPostList";
import CommunityPostSmall from "components/Communities/CommunityPostSmall";
import { fetchCommunities } from "../../components/Explore/communityData"; // 기본 내보내기
import { dummyPostData } from "components/Dummydata";
const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

  const [currentTab, clickTab] = useState(0);
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    const getCommunities = async () => {
      const data = await fetchCommunities(query);
      console.log(data); // 데이터를 콘솔에 출력하여 확인
      console.log(query); // 쿼리가 잘 가져와지는지 확인
      setCommunities(data);
    };

    getCommunities();
  }, [query]);

  const menuArr = [
    {
      name: "커뮤니티",
      content: (
        <>
          {communities.map((community) => (
            <CommunityPostSmall
              key={community.communityid}
              communityimg={community.image}
              communityname={community.name}
              person={community.membercount} // 인원 수
              post={community.postcount} // 게시글 수
              date={new Date(community.createdat).toLocaleDateString()} // 시작일 포맷
              communityicon="icon_url_here" // 아이콘 URL (여기에 실제 URL을 넣어주세요)
            />
          ))}
        </>
      ), // 검색 결과에 맞게 데이터 전달
      data: communities, // 데이터를 추가하여 비어있는지 확인 가능
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

      {menuArr[currentTab].data && menuArr[currentTab].data.length > 0 ? (
        <div className={styles.desc}>{menuArr[currentTab].content}</div>
      ) : (
        <div className={styles.Nosearchresults}>검색 결과가 없습니다.</div>
      )}
    </div>
  );
};

export default SearchResults;
