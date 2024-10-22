import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "./DMChat.module.css";
import MyMessage from "./MyMessage";
import OtherMessage from "./OtherMessage";
import DeleteIcon from "assets/icons/Messages/Delete.png";
import DeleteModal from "./DeleteModal";
import supabase from "components/supabaseClient";
import defaultprofile from "assets/icons/Messages/Profile.jpg"
import noprofile from "assets/images/Profile/noprofile.png"
function DMChat({ selectedUser, publicUser }) {
  const [chatData, setChatData] = useState([]);  // 실제 메시지 데이터
  const [message, setMessage] = useState("");  // 전송할 메시지
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Supabase에서 실제 메시지 데이터를 가져오는 로직
  const fetchChatData = async () => {
    if (publicUser && selectedUser) {
      // DirectMessage 테이블에서 메시지 데이터 가져오기
      const { data, error } = await supabase
        .from("DirectMessage")
        .select("*")
        .or(
          `and(new_senderid.eq.${publicUser.userid},new_receiverid.eq.${selectedUser.userid}),` +
          `and(new_senderid.eq.${selectedUser.userid},new_receiverid.eq.${publicUser.userid})`
        )
        .order("createdat", { ascending: true });  // 메시지를 시간순으로 정렬

      if (error) {
        console.error("Error fetching chat data:", error);
      } else {
        setChatData(data);  // 가져온 데이터를 상태로 설정
      }
    }
  };

  useEffect(() => {
    fetchChatData();
  }, [publicUser, selectedUser]);

  // 메시지 전송 핸들러
  const handleSendMessage = async () => {
    if (message.trim() === "") return;  // 빈 메시지 방지

    const { error } = await supabase
      .from("DirectMessage")
      .insert([{
        content: message,
        new_senderid: publicUser.userid,  // 보낸 사람 ID
        new_receiverid: selectedUser.userid,  // 받는 사람 ID
        createdat: new Date().toISOString(),  // 생성 시간
      }]);

    if (error) {
      console.error("Error sending message:", error.message);
    } else {
      setMessage("");  // 메시지 입력 필드 초기화
      fetchChatData();  // 메시지 전송 후 채팅 데이터 다시 불러오기
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
  };

  // Helper functions to check if a message is the last or first of a group
  const isLastMessage = (index, messages) => {
    return (
      index === messages.length - 1 ||
      messages[index + 1]?.new_senderid !== messages[index]?.new_senderid
    );
  };

  const isFirstMessage = (index, messages) => {
    return (
      index === 0 || messages[index - 1]?.new_senderid !== messages[index]?.new_senderid
    );
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <img
          src={selectedUser.profileimage || noprofile}  // 프로필 이미지가 없으면 기본 이미지 사용
          className={styles.profileImage}
          alt="Profile"
        />
        <div className={styles.headerText}>
          {selectedUser ? `${selectedUser.nickname}` : "No user selected"}
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
        {chatData.length > 0 ? (
          chatData.map((chat, index) => {
            const showProfileImage =
              isFirstMessage(index, chatData) && chat.new_senderid !== publicUser.userid;
            const lastMessage = isLastMessage(index, chatData);
            const showDateDivider =
              index === 0 || chatData[index - 1].createdat.split("T")[0] !== chat.createdat.split("T")[0];

            return (
              <div key={chat.messageid} className={styles.messageGroup}>
                {showDateDivider && (
                  <div className={styles.dateDivider}>{chat.createdat.split("T")[0]}</div>
                )}
                {/* {showProfileImage && (
                  <img
                    src={selectedUser.profileimage || noprofile}  // 프로필 이미지가 없으면 기본 이미지 사용
                    className={styles.profileImage}
                    alt="Profile"
                  />
                )} */}
                {chat.new_senderid === publicUser.userid ? (
                  lastMessage ? (
                    <MyMessage key={index} message={chat.content} last={true} />
                  ) : (
                    <MyMessage key={index} message={chat.content} />
                  )
                ) : lastMessage ? (
                  <OtherMessage key={index} message={chat.content} last={true} profile={selectedUser?.profileimage || noprofile} />
                ) : (
                  <OtherMessage key={index} message={chat.content} />
                )}
              </div>
            );
          })
        ) : (
          <div className={styles.noMessagesContainer}>
            <div className={styles.noMessages}>No messages yet.</div>
          </div>

        )}
      </div>
      <div className={styles.InputContainer}>
        <div className={styles.chatInputContainer}>
          <input
            className={styles.chatInput}
            placeholder="메시지 입력하기"
            value={message}
            onChange={(e) => setMessage(e.target.value)}  // 입력된 메시지를 상태로 저장
          />
          <button className={styles.chatButton} onClick={handleSendMessage}>보내기</button>
        </div>
      </div>
      {showDeleteModal && <DeleteModal onClose={handleCloseModal} />}
    </div>
  );
}

DMChat.propTypes = {
  selectedUser: PropTypes.object,
  publicUser: PropTypes.object,
};

export default DMChat;