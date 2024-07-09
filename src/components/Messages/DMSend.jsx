import React, { useState } from "react";
import styles from "./DMSend.module.css";
import SearchUserModal from "./SearchUserModal";

const dummyData = [
  { username: "우제", id: "godthunderzeus" },
  { username: "현준", id: "hyunjun123" },
  { username: "Faker(페이커)", id: "faker" },
  { username: "이민형", id: "t1_gumay" },
  { username: "류민석", id: "keria_minseok" },
  { username: "김강희", id: "t1_roach" },
  { username: "임재현", id: "lol_tom123" },
  { username: "이재완", id: "T1_wolf" },
  { username: "김정균", id: "T1_kkoma" },
  { username: "장경환", id: "T1_marine" },
];

function DMSend({ setIsSending, setSelectedUser }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setLocalSelectedUser] = useState(null);

  const handleUserClick = (user) => {
    setLocalSelectedUser(user);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = dummyData.filter(
    (user) => user.username.includes(searchTerm) || user.id.includes(searchTerm)
  );

  const handleSendMessage = () => {
    if (selectedUser) {
      setSelectedUser(selectedUser);
      setIsSending(false); // Close the DMSend modal after selecting a user
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