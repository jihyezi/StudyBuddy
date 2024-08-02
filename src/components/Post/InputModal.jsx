import React, { useState } from "react";
import styles from "./InputModal.module.css";
import "fonts/Font.css";
import SearchBookModal from "./SearchBookModal"; // 모달 컴포넌트 임포트

const InputModal = (props) => {
  const [selectedModal, setSelectedModal] = useState(props.placeholder);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.inputContainer}>
      <div className={styles.inputTitle}>{props.title}</div>
      <div className={styles.inputClick} onClick={handleClick}>
        <span className={styles.inputPlaceholder}>{selectedModal}</span>
      </div>

      {isModalOpen && (
        <>
          <div className={styles.overlay} onClick={closeModal}></div>{" "}
          {/* 배경 오버레이 */}
          <SearchBookModal closeModal={closeModal} /> {/* 모달 컴포넌트 */}
        </>
      )}
    </div>
  );
};

export default InputModal;
