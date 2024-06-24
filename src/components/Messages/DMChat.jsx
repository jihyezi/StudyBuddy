import React, { useState } from "react";
import styles from "./DMChat.module.css";
import MyMessage from "./MyMessage";
import OtherMessage from "./OtherMessage";
import DeleteIcon from "assets/icons/Messages/Delete.png";
import DeleteModal from "./DeleteModal";

const chatDummyData = [
  { type: "other", message: "확인하세요! 👌", date: "2024.06.24" },
  { type: "other", message: "확인했습니다! 👌", date: "2024.06.24" },
  { type: "my", message: "좋은 정보 감사합니다!", date: "2024.06.24" },
  { type: "other", message: "네, 감사합니다!", date: "2024.06.25" },
  { type: "my", message: "다음에 또 알려주세요.", date: "2024.06.25" },
  { type: "other", message: "알겠습니다!", date: "2024.06.25" },
];
const isLastMessage = (index, array) => {
  return (
    index === array.length - 1 || array[index + 1].type !== array[index].type
  );
};

const isFirstMessage = (index, array) => {
  return index === 0 || array[index - 1].type !== array[index].type;
};

function DMChat({ selectedUser }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <div className={styles.profileImage}></div>
        <div className={styles.headerText}>
          {selectedUser.username}
          <span className={styles.chatDate}>{selectedUser.date}</span>
        </div>
        <img
          src={DeleteIcon}
          alt="Delete Chat"
          className={styles.deleteIcon}
          onClick={handleDeleteClick}
        />
      </div>
      <div className={styles.chatContent}>
        {chatDummyData.map((chat, index) => {
          const showProfileImage =
            isFirstMessage(index, chatDummyData) && chat.type === "other";
          const lastMessage = isLastMessage(index, chatDummyData);
          return (
            <div key={index} className={styles.messageGroup}>
              {showProfileImage && <div className={styles.profileImage}></div>}
              {chat.type === "my" ? (
                lastMessage ? (
                  <MyMessage key={index} message={chat.message} last={true} />
                ) : (
                  <MyMessage key={index} message={chat.message} />
                )
              ) : lastMessage ? (
                <OtherMessage key={index} message={chat.message} last={true} />
              ) : (
                <OtherMessage key={index} message={chat.message} />
              )}
              {(index === 0 || chatDummyData[index - 1].date !== chat.date) && (
                <div className={styles.dateDivider}>{chat.date}</div>
              )}
            </div>
          );
        })}
      </div>
      <div className={styles.chatInputContainer}>
        <input className={styles.chatInput} placeholder="메시지 입력하기" />
        <button className={styles.chatButton}>보내기</button>
      </div>
      {showDeleteModal && <DeleteModal onClose={handleCloseModal} />}
    </div>
  );
}

export default DMChat;
