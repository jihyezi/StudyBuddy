import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./DMChat.module.css";
import MyMessage from "./MyMessage";
import OtherMessage from "./OtherMessage";
import DeleteIcon from "assets/icons/Messages/Delete.png";
import DeleteModal from "./DeleteModal";

const dummyChatData = [
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

function DMChat({ selectedUser, chatData = [] }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [useDummyData, setUseDummyData] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
  };

  const toggleChatData = () => {
    setUseDummyData(!useDummyData);
  };

  const dataToUse = useDummyData ? dummyChatData : chatData;

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <div className={styles.profileImage}></div>
        <div className={styles.headerText}>
          {selectedUser
            ? `${selectedUser.username} / @${selectedUser.id}`
            : "No user selected"}
        </div>
        {selectedUser && (
          <img
            src={DeleteIcon}
            alt="Delete Chat"
            className={styles.deleteIcon}
            onClick={handleDeleteClick}
          />
        )}
      </div>
      <div className={styles.chatContent}>
        {dataToUse.length > 0 ? (
          dataToUse.map((chat, index) => {
            const showProfileImage =
              isFirstMessage(index, dataToUse) && chat.type === "other";
            const lastMessage = isLastMessage(index, dataToUse);
            return (
              <div key={index} className={styles.messageGroup}>
                {showProfileImage && (
                  <div className={styles.profileImage}></div>
                )}
                {chat.type === "my" ? (
                  lastMessage ? (
                    <MyMessage key={index} message={chat.message} last={true} />
                  ) : (
                    <MyMessage key={index} message={chat.message} />
                  )
                ) : lastMessage ? (
                  <OtherMessage
                    key={index}
                    message={chat.message}
                    last={true}
                  />
                ) : (
                  <OtherMessage key={index} message={chat.message} />
                )}
                {(index === 0 || dataToUse[index - 1].date !== chat.date) && (
                  <div className={styles.dateDivider}>{chat.date}</div>
                )}
              </div>
            );
          })
        ) : (
          <div className={styles.noMessages}></div>
        )}
      </div>
      <div className={styles.chatInputContainer}>
        <input className={styles.chatInput} placeholder="메시지 입력하기" />
        <button className={styles.chatButton}>보내기</button>
      </div>
      <button onClick={toggleChatData} className={styles.toggleButton}>
        {useDummyData ? "Show Empty Chat" : "Show Dummy Data"}
      </button>
      {showDeleteModal && <DeleteModal onClose={handleCloseModal} />}
    </div>
  );
}

DMChat.propTypes = {
  selectedUser: PropTypes.object,
  chatData: PropTypes.array,
};

export default DMChat;
