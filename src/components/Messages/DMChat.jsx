import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./DMChat.module.css";
import MyMessage from "./MyMessage";
import OtherMessage from "./OtherMessage";
import DeleteIcon from "assets/icons/Messages/Delete.png";
import DeleteModal from "./DeleteModal";
import { supabase } from "App"; // Supabase 인스턴스 불러오기

const userId = "abcd"; // 실제 사용자 ID로 설정해야 합니다

const DMChat = ({ selectedUser, chatData = [] }) => {
  const [messages, setMessages] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
      const messageSubscription = supabase
        .channel('custom-all-channel')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'DirectMessage' }, (payload) => {
          setMessages((prevMessages) => [payload.new, ...prevMessages]);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(messageSubscription);
      };
    }
  }, [selectedUser]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("DirectMessage")
      .select("*")
      .eq("receiverid", selectedUser.id)
      .order("createdat", { ascending: false });

    if (error) {
      console.error("Error fetching messages:", error);
    } else {
      setMessages(data);
    }
  };

  const sendMessage = async () => {
    if (messageInput.trim() === "") return;

    const { error } = await supabase.from("DirectMessage").insert([
      {
        senderid: userId,
        receiverid: selectedUser.id,
        content: messageInput,
        createdat: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Error sending message:", error);
    } else {
      setMessageInput("");
    }
  };

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
            onClick={() => setShowDeleteModal(true)}
          />
        )}
      </div>
      <div className={styles.chatContent}>
        {messages.length > 0 ? (
          messages.map((chat, index) => {
            const showProfileImage =
              index === 0 || messages[index - 1].senderid !== chat.senderid;
            const lastMessage =
              index === messages.length - 1 ||
              messages[index + 1].senderid !== chat.senderid;

            return (
              <div key={index} className={styles.messageGroup}>
                {showProfileImage && <div className={styles.profileImage}></div>}
                {chat.senderid === userId ? (
                  <MyMessage key={index} message={chat.content} last={lastMessage} />
                ) : (
                  <OtherMessage key={index} message={chat.content} last={lastMessage} />
                )}
              </div>
            );
          })
        ) : (
          <div className={styles.noMessages}>No messages</div>
        )}
      </div>
      <div className={styles.chatInputContainer}>
        <input
          className={styles.chatInput}
          placeholder="메시지 입력하기"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button className={styles.chatButton} onClick={sendMessage}>
          보내기
        </button>
      </div>
      {showDeleteModal && <DeleteModal onClose={() => setShowDeleteModal(false)} />}
    </div>
  );
};

DMChat.propTypes = {
  selectedUser: PropTypes.object,
  chatData: PropTypes.array,
};

export default DMChat;