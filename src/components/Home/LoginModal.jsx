import React, { useState } from "react";
import Modal from "react-modal";
import styles from "./LoginModal.module.css"; // 스타일을 CSS 모듈로 가져오기

import EmailLoginModal from "./EmailLoginModal";

import googleimg from "assets/icons/Home/googleimg.png";
import emailimg from "assets/icons/Home/emailimg.png";
import close from "assets/icons/Home/close.png";
import modalMain from "assets/images/Home/modalMain.png";
// 모달을 화면 가운데에 위치시키기 위한 스타일
const customStyles = {
  content: {
    width: "520px",
    height: "479px",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "30px",
    borderColor: "#fff",
    opacity: "1", // 설정된 값은 0이지만, 보이도록 1로 설정
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.40)",
  },
};

Modal.setAppElement("#root"); // 접근성 향상을 위해 루트 엘리먼트를 설정

const LoginModal = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [emailModalIsOpen, setEmailModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const openEmailModal = () => {
    setEmailModalIsOpen(true);
    setModalIsOpen(false);
  };

  const closeEmailModal = () => {
    setEmailModalIsOpen(false);
  };

  return (
    <div>
      <button onClick={openModal} className={styles.openButton}>
        로그인
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="로그인 모달"
      >
        <div className={styles.modalImageContainer}>
          <img src={modalMain} alt="modal main" className={styles.modalImage} />
        </div>
        <div>
          <button onClick={closeModal} className={styles.closeButton}>
            <img src={close} />
          </button>
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.googleButton}>
            <img src={googleimg} style={{ paddingRight: 20 }} />
            Google 로그인
          </button>
          <button className={styles.emailButton} onClick={openEmailModal}>
            <img src={emailimg} style={{ paddingRight: 20 }} />
            Email 로그인
          </button>
        </div>
      </Modal>
      <EmailLoginModal
        modalIsOpen={emailModalIsOpen}
        closeModal={closeEmailModal}
      />
    </div>
  );
};

export default LoginModal;
