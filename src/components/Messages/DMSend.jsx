// DMSend.js

import React, { useState } from "react";
import styles from "./DMSend.module.css";
import SearchUserModal from "./SearchUserModal";
import supabase from "../supabaseClient";

function DMSend({ setIsSending, setSelectedUser }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setLocalSelectedUser] = useState(null);

  const handleSearchChange = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredUsers([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("users") // 유저 테이블에서 검색
        .select("userid, username, nickname, profileimage")
        .or(`username.ilike.%${term}%,nickname.ilike.%${term}%`); // `or` 조건으로 username과 nickname 모두 검색 가능하게

      if (error) {
        console.error("Error searching users:", error);
      } else {
        setFilteredUsers(data); // 검색 결과를 상태에 저장
      }
    } catch (error) {
      console.error("Unexpected error:", error.message);
    }
  };

  const handleUserClick = (user) => {
    setLocalSelectedUser(user); // 선택된 유저 업데이트
  };

  const handleSendMessage = () => {
    if (selectedUser) {
      setSelectedUser(selectedUser); // 상위 컴포넌트에 선택된 유저 업데이트
      setIsSending(false); // 검색 모달 닫기
    }
  };

  return (
    <div className={styles.sendModal}>
      <SearchUserModal
        setIsSending={setIsSending}
        filteredUsers={filteredUsers}
        handleUserClick={handleUserClick}
        selectedUser={selectedUser}
        handleSearchChange={handleSearchChange}
        searchTerm={searchTerm}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}

export default DMSend;