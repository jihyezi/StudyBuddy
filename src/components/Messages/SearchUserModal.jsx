import React from "react";
import styles from "./SearchUserModal.module.css";
import closeIcon from "assets/icons/Messages/close.png";
import noprofile from "assets/images/Profile/noprofile.png";

function SearchUserModal({
  setIsSending,
  filteredUsers,
  handleUserClick,
  selectedUser,
  handleSearchChange,
  searchTerm,
  onSendMessage,
}) {
  return (
    <div className={styles.searchUserModal}>
      <div className={styles.searchUserModalHeader}>
        <img
          className={styles.closeIcon}
          src={closeIcon}
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
            {selectedUser.username}
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
          filteredUsers.map((user) => (
            <div
              key={user.userid}
              className={`${styles.userItem} ${selectedUser && selectedUser.userid === user.userid
                ? styles.selected
                : ""
                }`}
              onClick={() => handleUserClick(user)}
            >
              <img src={user.profileimage || noprofile} alt="Profile" className={styles.profileImage} />
              <div className={styles.userInfo}>
                <span className={styles.username}>{user.username}</span>
              </div>
            </div>
          ))}
        {selectedUser && <div className={styles.emptyUserList}></div>}
      </div>
    </div>
  );
}

export default SearchUserModal;