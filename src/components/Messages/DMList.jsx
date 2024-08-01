import React, { useState } from "react";
import styles from "./DMList.module.css";
import DMChat from "./DMChat";
import DMSend from "./DMSend"; // 추가된 부분
import SendMessageIcon from "assets/icons/Messages/SendMessage.png";
import profile from 'assets/images/faker2.jpg'
import profile2 from 'assets/images/gromit.jpeg'
import profile3 from 'assets/images/profile1.png'

const dummyData = [
  {
    profile: profile,
    username: "우제",
    id: "godthunderzeus",
    date: "2023.02.04",
    message: "정보 감사합니다💕",
  },
  {
    profile: profile2,
    username: "현준",
    id: "hyunjun123",
    date: "2023.02.05",
    message: "확인했습니다😊",
  },
  {
    profile: profile3,
    username: "Faker(페이커)",
    id: "faker",
    date: "2023.02.06",
    message: "확인했습니다👀",
  },
  {
    profile: profile,
    username: "이민형",
    id: "t1_gumay",
    date: "2023.02.07",
    message: "굿굿! 👍",
  },
  {
    profile: profile2,
    username: "류민석",
    id: "keria_minseok",
    date: "2023.02.08",
    message: "알려줘서 고마워요! 🙌",
  },
  {
    profile: profile3,
    username: "김강희",
    id: "t1_roach",
    date: "2023.02.09",
    message: "너무 아쉽네요 😢",
  },
  {
    profile: profile,
    username: "임재현",
    id: "lol_tom123",
    date: "2023.02.10",
    message: "확인했습니다! 👌",
  },
];

function DMList() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const handleUserClick = (user) => {
    if (selectedUser && selectedUser.id === user.id) {
      setSelectedUser(null);
    } else {
      setSelectedUser(user);
    }
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
          {dummyData.map((message, index) => (
            <div
              className={`${styles.messageItem} ${selectedUser && selectedUser.id === message.id
                ? styles.selected
                : ""
                }`}
              key={index}
              onClick={() => handleUserClick(message)}
            >
              <img src={message.profile} className={styles.profileImage} />
              <div className={styles.messageContent}>
                <div className={styles.messageHeader}>
                  <span className={styles.username}>{message.username}</span>
                  <span className={styles.id}>@{message.id}</span>
                </div>
                <div className={styles.text}>{message.message}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedUser ? (
        <DMChat selectedUser={selectedUser} />
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
