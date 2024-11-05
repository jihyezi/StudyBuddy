import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import supabase from "components/supabaseClient";
import styles from "./DMChat.module.css";
import MyMessage from "./MyMessage";
import OtherMessage from "./OtherMessage";
import DeleteIcon from "assets/icons/Messages/Delete.png";
import DeleteModal from "./DeleteModal";
import noprofile from "assets/images/Profile/noprofile.png";

const fetchChatData = async (publicUserId, selectedUserId) => {
  if (!publicUserId || !selectedUserId) {
    throw new Error("Sender or receiver ID is missing");
  }

  const { data, error } = await supabase
    .from("DirectMessage")
    .select("*")
    .or(
      `and(new_senderid.eq.${publicUserId},new_receiverid.eq.${selectedUserId}),` +
      `and(new_senderid.eq.${selectedUserId},new_receiverid.eq.${publicUserId})`
    )
    .order("createdat", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
};

function DMChat({ selectedUser }) {
  const [message, setMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const queryClient = useQueryClient();
  const publicUserId = localStorage.getItem("userId"); // 로컬 스토리지에서 직접 userId 가져오기

  useEffect(() => {
    console.log("publicUserId:", publicUserId); // publicUserId 확인
    if (!publicUserId || !selectedUser) return;

    const channel = supabase
      .channel("chat_channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "DirectMessage" },
        () =>
          queryClient.invalidateQueries({
            queryKey: ["chatData", publicUserId, selectedUser.userid],
          })
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [publicUserId, selectedUser, queryClient]);

  const { data: chatData, refetch } = useQuery({
    queryKey: ["chatData", publicUserId, selectedUser?.userid],
    queryFn: () => fetchChatData(publicUserId, selectedUser.userid),
    enabled: !!publicUserId && !!selectedUser?.userid,
    staleTime: 1000 * 60 * 1,
  });

  const handleSendMessage = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      console.warn("Cannot send an empty message.");
      return;
    }

    if (!publicUserId) {
      console.error("Sender ID (publicUserId) is missing.");
      return;
    }
    if (!selectedUser || !selectedUser.userid) {
      console.error("Receiver ID (selectedUser) is missing.");
      return;
    }

    console.log("Sending message with sender ID:", publicUserId); // 메시지 전송 전 publicUserId 확인

    // 메시지 삽입 시도
    const { data, error } = await supabase.from("DirectMessage").insert([
      {
        content: trimmedMessage,
        new_senderid: publicUserId, // 로컬 스토리지에서 가져온 userId 사용
        new_receiverid: selectedUser.userid,
        createdat: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Error sending message:", error.message);
      return;
    }

    console.log("Message sent successfully:", data); // 삽입 성공 확인

    setMessage(""); // 메시지 전송 후 상태 초기화

    // 최신 데이터 가져오기
    refetch()
      .then(() => {
        console.log("Refetch complete: chat data updated.");
      })
      .catch((err) => {
        console.error("Error during refetch:", err);
      });
  };

  const handleDeleteConversation = async () => {
    try {
      const { error } = await supabase
        .from("DirectMessage")
        .delete()
        .or(
          `and(new_senderid.eq.${publicUserId},new_receiverid.eq.${selectedUser.userid}),` +
          `and(new_senderid.eq.${selectedUser.userid},new_receiverid.eq.${publicUserId})`
        );

      if (error) {
        console.error("Error deleting conversation:", error.message);
      } else {
        queryClient.invalidateQueries({
          queryKey: ["chatData", publicUserId, selectedUser.userid],
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
  };

  if (!publicUserId) return null;

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <img
          src={selectedUser.profileimage || noprofile}
          className={styles.profileImage}
          alt="Profile"
        />
        <div className={styles.headerText}>{selectedUser.nickname}</div>
        <img
          src={DeleteIcon}
          alt="Delete Chat"
          className={styles.deleteIcon}
          onClick={handleDeleteClick}
        />
      </div>
      <div className={styles.chatContent}>
        {chatData?.length > 0 ? (
          chatData.map((chat, index) =>
            chat.new_senderid === publicUserId ? (
              <MyMessage key={index} message={chat.content} />
            ) : (
              <OtherMessage key={index} message={chat.content} />
            )
          )
        ) : (
          <div className={styles.noMessagesContainer}>No messages yet.</div>
        )}
      </div>
      <div className={styles.InputContainer}>
        <input
          className={styles.chatInput}
          placeholder="메시지 입력하기"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className={styles.chatButton}
          onClick={handleSendMessage}
          disabled={!publicUserId}
        >
          보내기
        </button>
      </div>
      {showDeleteModal && (
        <DeleteModal onClose={handleCloseModal} onDelete={handleDeleteConversation} />
      )}
    </div>
  );
}

DMChat.propTypes = {
  selectedUser: PropTypes.object.isRequired,
};

export default DMChat;