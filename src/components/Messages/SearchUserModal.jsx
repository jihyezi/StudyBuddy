// SearchUserModal.js

import React from "react";
import styles from "./SearchUserModal.module.css";
import close from "assets/icons/Messages/close.png";

const SearchUserModal = ({
  setIsSending,
  filteredUsers,
  handleUserClick,
  selectedUser,
  handleSearchChange,
  searchTerm,
  onSendMessage,
}) => {
  return (
    <div className={styles.searchUserModal}>
      <div className={styles.searchUserModalHeader}>
        <img
          className={styles.closeIcon}
          src={close}
          alt="close"
          onClick={() => setIsSending(false)}
        />
        <div className={styles.newMessage}>New Message</div>
        <div className={styles.send} onClick={onSendMessage}>
          Send
        </div>
      </div>
      <div className={styles.searchUserModalMiddle}>
        <span className={styles.sendTo}>Send to :</span>
        {selectedUser ? (
          <span className={styles.selectedUser}>
            {selectedUser.nickname} / @{selectedUser.username}
            <span
              className={styles.removeUser}
              onClick={() => handleUserClick(null)}
            >
              ×
            </span>
          </span>
        ) : (
          <input
            className={styles.input}
            type="text"
            placeholder="Search People..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        )}
      </div>
      <div className={styles.userList}>
        {!selectedUser &&
          (filteredUsers || []).map((user, index) => (
            <div
              key={index}
              className={`${styles.userItem} ${
                selectedUser && selectedUser.userid === user.userid
                  ? styles.selected
                  : ""
              }`}
              onClick={() => handleUserClick(user)}
            >
              <div className={styles.profileImage}>
                {user.profileimage ? (
                  <img src={user.profileimage} alt="Profile" />
                ) : (
                  <div className={styles.defaultProfileImage}></div>
                )}
              </div>
              <div className={styles.userInfo}>
                <span className={styles.username}>{user.nickname}</span>
                <span className={styles.id}>@{user.username}</span>
              </div>
            </div>
          ))}
        {selectedUser && <div className={styles.emptyUserList}></div>}
      </div>
    </div>
  );
};

export default SearchUserModal;