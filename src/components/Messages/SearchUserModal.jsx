import React, { useEffect, useState, useRef } from "react";
import styles from "./SearchUserModal.module.css";
import "fonts/Font.css";

// icon
import close from "assets/icons/Messages/close.png";

const SearchUserModal = ({}) => {
  return (
    <div className={styles.searchUserModal}>
      <div className={styles.searchUserModalHeader}>
        <img className={styles.closeIcon} src={close} alt="close" />
        <div className={styles.newMessage}>New Message</div>
        <div className={styles.send}>Send</div>
      </div>
      <div className={styles.searchUserModalMiddle}>
        <span className={styles.sendTo}>Send to :</span>
        <input
          className={styles.input}
          type="text"
          placeholder="Search People..."
        />
      </div>
      <div style={{ minHeight: "400px" }}></div>
    </div>
  );
};
export default SearchUserModal;
