import React, { useState, useEffect } from "react";
import { useAuth } from "contexts/AuthContext";  // AuthContext에서 인증된 유저 정보 가져오기
import supabase from "components/supabaseClient";
import styles from "./DMList.module.css";
import DMChat from "./DMChat";
import DMSend from "./DMSend";
import SendMessageIcon from "assets/icons/Messages/SendMessage.png";

function DMList() {
  const { user } = useAuth();  // 현재 로그인한 유저 정보 가져오기
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [userData, setUserData] = useState([]);  // 다른 유저들의 데이터
  const [publicUser, setPublicUser] = useState(null);  // 현재 로그인한 유저의 Public 스키마 정보

  useEffect(() => {
    const fetchUsers = async () => {
      if (user) {
        try {
          // 현재 로그인한 유저의 Public 스키마 정보를 가져오기
          const { data: currentUserData, error: currentUserError } = await supabase
            .from("User")
            .select("userid, username, profileimage")
            .eq("email", user.email)
            .single();  // 현재 로그인한 유저 정보

          if (currentUserError) {
            throw currentUserError;
          }

          setPublicUser(currentUserData);  // Public 유저 정보 설정

          // 다른 유저들의 데이터를 가져오기 (현재 로그인한 유저 제외)
          const { data: otherUsersData, error: otherUsersError } = await supabase
            .from("User")
            .select("userid, username, profileimage")
            .neq("email", user.email);  // 로그인한 유저의 이메일 제외

          if (otherUsersError) {
            throw otherUsersError;
          }

          setUserData(otherUsersData);  // 다른 유저 데이터 상태에 저장
        } catch (error) {
          console.error("Error fetching users:", error.message);
        }
      }
    };

    fetchUsers();
  }, [user]);

  const handleUserClick = (user) => {
    if (selectedUser && selectedUser.userid === user.userid) {
      setSelectedUser(null);
    } else {
      setSelectedUser(user);
    }
  };

  const handleNewMessageClick = () => {
    setIsSending(true);
  };

  const handleSendMessage = (user) => {
    if (!userData.some((item) => item.userid === user.userid)) {
      setUserData((prevData) => [...prevData, user]);
    }
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
              className={`${styles.messageItem} ${
                selectedUser && selectedUser.userid === user.userid
                  ? styles.selected
                  : ""
              }`}
              key={index}
              onClick={() => handleUserClick(user)}
            >
              <img src={user.profileimage || SendMessageIcon} className={styles.profileImage} alt="Profile" />
              <div className={styles.messageContent}>
                <div className={styles.messageHeader}>
                  <span className={styles.username}>{user.username}</span>
                  <span className={styles.id}>@{user.userid}</span>
                </div>
                <div className={styles.text}>Start chatting with {user.username}!</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedUser ? (
        <DMChat selectedUser={selectedUser} publicUser={publicUser} />  
      ) : (
        <div className={styles.noChat} onClick={handleNewMessageClick}>
          <img
            src={SendMessageIcon}
            alt="New Message"
            className={styles.newMessageIcon}
          />
          <div className={styles.newMessageText}>New Message</div>
        </div>
      )}
      {isSending && (
        <DMSend
          setIsSending={setIsSending}
          setSelectedUser={handleSendMessage}
        />
      )}
    </div>
  );
}

export default DMList;