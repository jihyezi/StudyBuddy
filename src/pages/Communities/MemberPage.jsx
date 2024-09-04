import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./MemberPage.module.css";
import profile from "assets/images/profile1.png";
import supabase from "components/supabaseClient";

const MemberPage = () => {
  const { communityId } = useParams();
  const [joinCommunity, setJoinCommunity] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [memberUsers, setMemberUsers] = useState([]);

  useEffect(() => {
    fetchJoinCommunityDataById(communityId);
  }, [communityId]);

  const fetchJoinCommunityDataById = async (communityId) => {
    const { data, error } = await supabase
      .from("JoinCommunity")
      .select("*")
      .eq("communityid", communityId);

    if (error) {
      console.error("Error fetching data:", error);
    } else {
      setJoinCommunity(data);
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

    // 역할에 따라 분리
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
    <div className={styles.container}>
      <div className={styles.section}>
        <div className={styles.title}>Admin</div>
        {adminUsers.map((user, index) => (
          <div key={index} className={styles.userItem}>
            <img
              src={user.profile || profile}
              className={styles.profileImage}
              alt="profile"
            />
            <div className={styles.userInfo}>
              <span className={styles.nickname}>{user.nickname}</span>
              <span className={styles.userId}>{user.id}</span>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.section}>
        <div className={styles.title}>Members</div>
        <div className={styles.userList}>
          {memberUsers.map((user, index) => (
            <div key={index} className={styles.userItem}>
              <img
                src={user.profile || profile}
                className={styles.profileImage}
                alt="profile"
              />
              <div className={styles.userInfo}>
                <span className={styles.nickname}>{user.nickname}</span>
                <span className={styles.userId}>{user.id}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemberPage;
