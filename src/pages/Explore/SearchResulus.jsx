import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./SearchResulus.module.css";

import JoinPostList from "components/Communities/CommunityJoinPostList";
import CommunityPostSmall from "components/Communities/CommunityPostSmall";
import { fetchCommunities } from "../../components/Explore/communityData";
import { dummyPostData } from "components/Dummydata";

import supabase from "components/supabaseClient";

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

  const [currentTab, clickTab] = useState(0);
  const [communities, setCommunities] = useState([]);
  const [posts, setPosts] = useState([]); // 게시물 데이터를 저장할 상태 추가

  useEffect(() => {
    const getCommunities = async () => {
      const data = await fetchCommunities(query);
      setCommunities(data);
    };

    getCommunities();
  }, [query]);

  // 전체글 탭에 대해 Supabase에서 데이터 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      // title 또는 community name으로 검색
      const { data, error } = await supabase
        .from("Post")
        .select("*")
        .ilike("title", `%${query}%`); // title에서 query를 포함하는 모든 게시물 가져오기

      if (error) {
        console.error("Error fetching posts:", error);
      } else {
        setPosts(data);
      }
    };

    fetchPosts();
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
              person={community.membercount}
              post={community.postcount}
              date={new Date(community.createdat).toLocaleDateString()}
              communityicon="icon_url_here"
            />
          ))}
        </>
      ),
      data: communities,
    },
    {
      name: "전체글",
      content: <JoinPostList postData={posts} />, // 여기서 Supabase에서 가져온 post 데이터를 사용
      data: posts,
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
