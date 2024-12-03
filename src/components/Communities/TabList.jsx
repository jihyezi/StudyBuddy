import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./TabList.module.css";
import supabase from "components/supabaseClient";

// Components
import JoinPostList from "./CommunityJoinPostList";
import RulePage from "pages/Communities/RulePage";
import MemberPage from "pages/Communities/MemberPage";
import { useQuery } from "@tanstack/react-query";

// Data
const fetchPostData = async () => {
  const { data, error } = await supabase.from("Post").select("*");
  if (error) throw new Error(error.message);
  return data;
};

const fetchJoinCommunityDataById = async (communityId) => {
  const { data, error } = await supabase
    .from("JoinCommunity")
    .select("*")
    .eq("communityid", communityId);

  if (error) throw new Error(error.message);
  return data;
};

const fetchUserDataByIds = async (userIds) => {
  const usersDataPromises = userIds.map(async (userId) => {
    const { data, error } = await supabase
      .from("User")
      .select("*")
      .eq("userid", userId);

    if (error) throw new Error(error.message);
    return data[0];
  });

  const usersData = await Promise.all(usersDataPromises);
  return usersData.filter(Boolean);
};

export const TabList = ({ communityData }) => {
  const [currentTab, clickTab] = useState(0);
  const { communityId } = useParams();
  const [adminUsers, setAdminUsers] = useState([]);
  const [memberUsers, setMemberUsers] = useState([]);
  const [popularPost, setPopularPost] = useState([]);

  const { data: postData, isLoading: isPostLoading } = useQuery({
    queryKey: ["Post"],
    queryFn: fetchPostData,
    refetchInterval: 5000,
  });

  const {
    data: joinCommunityData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["JoinCommunity", communityId],
    queryFn: () => fetchJoinCommunityDataById(communityId),
    enabled: !!communityId,
  });

  const filterPost = useMemo(() => {
    return (Array.isArray(postData) ? postData : []).filter(
      (p) => Number(p.communityid) === Number(communityId)
    );
  }, [postData]);

  const filterCommunity = useMemo(() => {
    return (Array.isArray(communityData) ? communityData : []).filter(
      (c) => Number(c.communityid) === Number(communityId)
    );
  }, [communityData]);

  const popularPosts = useMemo(() => {
    return filterPost
      .map((post) => {
        const likeCount =
          popularPost.find((item) => item.postid === post.postid)?.like_count ||
          0;
        return { ...post, like_count: likeCount };
      })
      .sort((a, b) => b.like_count - a.like_count);
  }, [filterPost, popularPost]);

  const recentPosts = useMemo(() => {
    return [...filterPost].sort(
      (a, b) => new Date(b.createdat) - new Date(a.createdat)
    );
  }, [filterPost]);

  const menuArr = [
    {
      name: "인기",
      content: <JoinPostList postData={popularPosts} />,
    },
    {
      name: "최근",
      content: <JoinPostList postData={recentPosts} />,
    },
    { name: "규칙", content: <RulePage ruleData={filterCommunity} /> },
    {
      name: "멤버",
      content: <MemberPage adminData={adminUsers} memberData={memberUsers} />,
    },
  ];

  const selectMenuHandler = (index) => {
    clickTab(index);
  };

  useEffect(() => {
    if (joinCommunityData) {
      const userIds = joinCommunityData.map((user) => user.userid);
      fetchUserDataByIds(userIds).then((filteredUsers) => {
        const admins = joinCommunityData
          .filter((item) => item.role === "admin")
          .map((item) => {
            const user = filteredUsers.find(
              (user) => user.userid === item.userid
            );
            return { ...user, role: item.role };
          });

        const members = joinCommunityData
          .filter((item) => item.role === "member")
          .map((item) => {
            const user = filteredUsers.find(
              (user) => user.userid === item.userid
            );
            return { ...user, role: item.role };
          });

        setAdminUsers(admins);
        setMemberUsers(members);
      });
    }
  }, [joinCommunityData]);

  useEffect(() => {
    fetchPopularPost();
  }, [postData]);

  const fetchPopularPost = async () => {
    const { data, error } = await supabase
      .from("popular_posts_view")
      .select("*");

    if (error) {
      console.error("Error fetching popular posts:", error);
    } else {
      setPopularPost(data);
    }
  };

  return (
    <div>
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
      <div className={styles.desc}>
        <p>{menuArr[currentTab].content}</p>
      </div>
    </div>
  );
};

export default TabList;
