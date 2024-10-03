import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./SearchResulus.module.css";

import JoinPostList from "components/Communities/CommunityJoinPostList";
import CommunityPostSmall from "components/Communities/CommunityPostSmall";
import { fetchCommunities } from "../../components/Explore/communityData";
import { dummyPostData } from "components/Dummydata";
import supabase from "components/supabaseClient";
import { useAuth } from "contexts/AuthContext";

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

  const [currentTab, clickTab] = useState(0);
  const [communities, setCommunities] = useState([]);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [communityInfo, setCommunityInfo] = useState([]);
  const [commentData, setCommentData] = useState([]);
  const [allUser, setAllUser] = useState([]);
  // const { user: sessionUser } = useAuth();

  useEffect(() => {
    const getCommunities = async () => {
      const data = await fetchCommunities(query);
      setCommunities(data);
    };

    getCommunities();
  }, [query]);

  useEffect(() => {
    const fetchPostsUsersAndCommunities = async () => {
      try {
        const { data: postsData, error: postsError } = await supabase
          .from("Post")
          .select("*")
          .ilike("title", `%${query}%`);

        if (postsError) {
          console.error("Error fetching posts:", postsError);
          return;
        }

        if (!postsData || postsData.length === 0) {
          console.log("No posts found for the given query.");
          setPosts([]); // No posts, set to empty
          return;
        }

        const userIds = postsData.map((post) => post.userid);
        const { data: usersData, error: usersError } = await supabase
          .from("User")
          .select("*")
          .in("userid", userIds);

        if (usersError) {
          console.error("Error fetching users:", usersError);
          return;
        }

        const communityIds = postsData.map((post) => post.communityid);
        const { data: communityData, error: communityError } = await supabase
          .from("Community")
          .select("*")
          .in("communityid", communityIds);

        if (communityError) {
          console.error("Error fetching community data:", communityError);
          return;
        }

        const allComments = await Promise.all(
          postsData.map(async (post) => {
            const { data: comments, error: commentError } = await supabase
              .from("Comment")
              .select("*")
              .eq("postid", post.postid);
            if (commentError) {
              console.error("Error fetching comments:", commentError);
              return [];
            }
            return comments;
          })
        );

        setPosts(postsData);
        setUsers(usersData);
        setCommunityInfo(communityData);
        setCommentData(allComments);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPostsUsersAndCommunities();
  }, [query]); // query가 변경될 때마다 데이터 fetch

  useEffect(() => {
    const fetchAllUserData = async () => {
      const { data, error } = await supabase.from("User").select("*");

      if (error) {
        console.error("Error fetching all user data:", error);
      } else {
        setAllUser(data);
      }
    };
    fetchAllUserData();
  }, []);

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
          allUserData={allUser}
        />
      ),
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
