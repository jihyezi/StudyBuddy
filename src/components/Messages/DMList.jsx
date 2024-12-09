import React, { useState, useEffect } from "react";
import { useAuth } from "contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import supabase from "components/supabaseClient";
import styles from "./DMList.module.css";
import DMChat from "./DMChat";
import DMSend from "./DMSend";
import noprofile from "assets/images/Profile/noprofile.png";

const fetchUsers = async (userEmail) => {
  const { data: otherUsersData, error } = await supabase
    .from("User")
    .select("userid, username, nickname, profileimage")
    .neq("email", userEmail);

  if (error) throw new Error(error.message);
  return otherUsersData;
};

function DMList() {
  const { user, loading } = useAuth(); // loading 상태 추가
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {

    if (user) {
      const channel = supabase
        .channel("user_update_channel")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "User" },
          () => queryClient.invalidateQueries({ queryKey: ["users"] })
        )
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    }
  }, [user, loading, navigate, queryClient]);

  const { data: userData, isLoading, error } = useQuery({
    queryKey: ["users", user?.email],
    queryFn: () => fetchUsers(user.email),
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });

  if (loading) return <div>Loading...</div>; // 로딩 중일 때 표시
  if (!user) return null; // user가 없으면 아무것도 렌더링하지 않음
  if (isLoading) return <div>Loading user data...</div>;
  if (error) return <div>Error fetching users</div>;

  const handleUserClick = (user) => {
    setSelectedUser((prevUser) =>
      prevUser && prevUser.userid === user.userid ? null : user
    );
  };

  const handleNewMessageClick = () => {
    setIsSending(true);
  };

  const handleSendMessage = (user) => {
    setSelectedUser(user);
    setIsSending(false);
  };

  return (
    <div className={styles.dmListContainer}>
      <div className={styles.modal}>
        <div className={styles.header}>Messages</div>
        <div className={styles.messageList}>
          {userData.map((user, index) => (
            <div
              className={`${styles.messageItem} ${selectedUser && selectedUser.userid === user.userid
                  ? styles.selected
                  : ""
                }`}
              key={index}
              onClick={() => handleUserClick(user)}
            >
              <img
                src={user.profileimage || noprofile}
                className={styles.profileImage}
                alt="Profile"
              />
              <div className={styles.messageContent}>
                <div className={styles.messageHeader}>
                  <span className={styles.username}>{user.nickname}</span>
                  <span className={styles.nickname}>@{user.username}</span>
                </div>
                <div className={styles.text}>
                  Start chatting with {user.nickname || user.username}!
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedUser ? (
        <DMChat selectedUser={selectedUser} publicUser={user} />
      ) : (
        <div className={styles.noChat} onClick={handleNewMessageClick}>
          <img
            src={noprofile}
            alt="New Message"
            className={styles.newMessageIcon}
          />
          <div className={styles.newMessageText}>New Message</div>
        </div>
      )}
      {isSending && (
        <DMSend setIsSending={setIsSending} setSelectedUser={handleSendMessage} />
      )}
    </div>
  );
}

export default DMList;
