import React from "react";
import styles from "./SearchBookModal.module.css";
import "fonts/Font.css";
import close from "assets/icons/Messages/close.png";

const SearchBookModal = ({ closeModal }) => {
  return (
    <div className={styles.searchBookModal}>
      <div className={styles.searchBookModalHeader}>
        <img
          className={styles.closeIcon}
          src={close}
          alt="close"
          onClick={closeModal} // 닫기 아이콘 클릭 시 모달 닫기
        />
        <div className={styles.newMessage}>책 검색</div>
        <div className={styles.send}>Send</div>
      </div>
      <div className={styles.searchBookModalMiddle}>
        <span className={styles.sendTo}>Send to :</span>
        <input
          className={styles.input}
          type="text"
          placeholder="Search Book..."
        />
      </div>
      <div style={{ minHeight: "400px" }}></div>
    </div>
  );
};

export default SearchBookModal;
