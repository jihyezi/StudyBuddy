import React, { useState, useEffect } from "react";
import { useAuth } from "contexts/AuthContext";  // AuthContext에서 인증된 유저 정보 가져오기
import supabase from "components/supabaseClient";
import styles from "./DMSend.module.css";
import SearchUserModal from "./SearchUserModal";

function DMSend({ setIsSending, setSelectedUser }) {
  const { user } = useAuth();  // 현재 로그인한 유저 정보 가져오기
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setLocalSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (user) {
        // 현재 로그인한 유저의 데이터를 제외하고 다른 유저들의 데이터 불러오기
        const { data, error } = await supabase
          .from("User")
          .select("userid, username, profileimage")
          .neq("email", user.email);  // 로그인한 유저의 이메일 제외

        if (error) {
          console.error("Error fetching users:", error.message);
        } else {
          setFilteredUsers(data);  // 다른 유저 데이터 설정
        }
      }
    };

    fetchUsers();
  }, [user]);

  const handleUserClick = (user) => {
    setLocalSelectedUser(user);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    const filtered = filteredUsers.filter(
      (user) =>
        user.username.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleSendMessage = () => {
    if (selectedUser) {
      setSelectedUser(selectedUser);  // 선택된 유저 설정
      setIsSending(false);  // 모달 닫기
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
