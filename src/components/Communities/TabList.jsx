import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./TabList.module.css";
import supabase from "components/supabaseClient";
import { useAuth } from "contexts/AuthContext";

import JoinPostList from "./CommunityJoinPostList";
import Post from "./Post";
import RulePage from "pages/Communities/RulePage";
import MemberPage from "pages/Communities/MemberPage";

export const TabList = () => {
  const [currentTab, clickTab] = useState(0);
  const { communityId } = useParams();
  const { user: sessionUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [rules, setRules] = useState(null);
  const [adminUsers, setAdminUsers] = useState([]);
  const [memberUsers, setMemberUsers] = useState([]);
  const [community, setCommunity] = useState([]);
  const [user, setUser] = useState([]);
  const [allUser, setAllUser] = useState([]);

  console.log(community)

  const menuArr = [
    {
      name: "인기",
      content: (
        <JoinPostList
          postData={posts}
          communityData={community}
          userData={user}
          allUserData={allUser}
        />
      ),
    },
    {
      name: "최근",
      content: (
        <JoinPostList
          postData={posts}
          communityData={community}
          userData={user}
          allUserData={allUser}
        />
      ),
    },
    { name: "규칙", content: <RulePage ruleData={rules} /> },
    {
      name: "멤버",
      content: <MemberPage adminData={adminUsers} memberData={memberUsers} />,
    },
  ];

  const selectMenuHandler = (index) => {
    clickTab(index);
  };

  useEffect(() => {
    fetchPostDataById(communityId);
    fetchCommunityDataById(communityId);
    fetchJoinCommunityDataById(communityId);
  }, [communityId]);

  useEffect(() => {
    fetchUserData();
    fetchAllUserData();
    fetchCommunityData();
  }, [sessionUser]);

  const fetchCommunityData = async () => {
    const { data, error } = await supabase.from("Community").select("*");

    if (error) {
      console.error("Error", error);
    } else {
      setCommunity(data);
    }
  };

  const fetchUserData = async () => {
    if (sessionUser) {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Error getting session:", sessionError);
        return;
      }

      const userId = session.user.id;

      const { data, error } = await supabase
        .from("User")
        .select("*")
        .eq("userid", userId);

      if (error) {
        console.error("Error", error);
      } else {
        setUser(data);
      }
    }
  };

  const fetchAllUserData = async () => {
    const { data, error } = await supabase.from("User").select("*");

    if (error) {
      console.error("Error", error);
    } else {
      setAllUser(data);
    }
  };

  const fetchPostDataById = async (communityId) => {
    const { data, error } = await supabase
      .from("Post")
      .select("*")
      .eq("communityid", communityId);

    if (error) {
      console.error("Error fetching data:", error);
    } else {
      setPosts(data);
    }
  };

  const fetchCommunityDataById = async (communityId) => {
    const { data, error } = await supabase
      .from("Community")
      .select("*")
      .eq("communityid", communityId);

    if (error) {
      console.error("Error fetching data:", error);
    } else {
      setRules(data);
    }
  };

  const fetchJoinCommunityDataById = async (communityId) => {
    const { data, error } = await supabase
      .from("JoinCommunity")
      .select("*")
      .eq("communityid", communityId);

    if (error) {
      console.error("Error fetching data:", error);
    } else {
      fetchJoinUsersData(data);
    }
  };

  const fetchJoinUsersData = async (joinCommunityData) => {
    const userIds = joinCommunityData.map((user) => user.userid);
    const usersDataPromises = userIds.map(async (userId) => {
      const { data, error } = await supabase
        .from("User")
        .select("*")
        .eq("userid", userId);
      return data[0];
    });

    const usersData = await Promise.all(usersDataPromises);
    const filteredUsers = usersData.filter(Boolean);

    const admins = joinCommunityData
      .filter((item) => item.role === "admin")
      .map((item) => {
        const user = filteredUsers.find((user) => user.userid === item.userid);
        return { ...user, role: item.role };
      });

    const members = joinCommunityData
      .filter((item) => item.role === "member")
      .map((item) => {
        const user = filteredUsers.find((user) => user.userid === item.userid);
        return { ...user, role: item.role };
      });

    setAdminUsers(admins);
    setMemberUsers(members);
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
