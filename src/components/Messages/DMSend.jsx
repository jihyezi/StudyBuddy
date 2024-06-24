import React, { useState } from "react";
import styles from "./DMSend.module.css";
import SearchUserModal from "./SearchUserModal";

const additionalUsers = [
  { username: "이재완", id: "T1_wolf" },
  { username: "김정균", id: "T1_kkoma" },
  { username: "장경환", id: "T1_marine" },
];

function DMSend({ setIsSending, dummyData }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = [...dummyData, ...additionalUsers].filter(
    (user) => user.username.includes(searchTerm) || user.id.includes(searchTerm)
  );

  return (
    <div className={styles.sendModal}>
      <SearchUserModal
        setIsSending={setIsSending}
        filteredUsers={filteredUsers}
        handleUserClick={handleUserClick}
        selectedUser={selectedUser}
        handleSearchChange={handleSearchChange}
        searchTerm={searchTerm}
      />
    </div>
  );
}

export default DMSend;
