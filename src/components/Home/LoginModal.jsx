import React, { useState } from "react";
import Modal from "react-modal";
import styles from "./LoginModal.module.css"; // 스타일을 CSS 모듈로 가져오기

import EmailLoginModal from "./EmailLoginModal";
import googleimg from "assets/icons/Home/googleimg.png";
import emailimg from "assets/icons/Home/emailimg.png";
import close from "assets/icons/Home/close.png";
import modalMain from "assets/images/Home/modalMain.png";
import { GoogleLogin } from "@react-oauth/google";
import GoogleLoginButton from "./GoogleLoginButton";

// 모달을 화면 가운데에 위치시키기 위한 스타일
const customStyles = {
  content: {
    width: "400px",
    height: "440px",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "30px",
    borderColor: "#fff",
    opacity: "1", // 설정된 값은 0이지만, 보이도록 1로 설정
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.40)",
    zIndex: 1000,
  },
};

Modal.setAppElement("#root"); // 접근성 향상을 위해 루트 엘리먼트를 설정

const LoginModal = ({ modalIsOpen, closeModal, openEmailLoginModal }) => {
  const [emailModalIsOpen, setEmailModalIsOpen] = useState(false);

  const openEmailModal = () => {
    setEmailModalIsOpen(true);
    closeModal();
  };

  const closeEmailModal = () => {
    setEmailModalIsOpen(false);
  };

  return (
    <div>
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
            <img src={close} alt="close" className={styles.btn} />
          </button>
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.emailButton} onClick={openEmailModal}>
            <img src={emailimg} style={{ paddingRight: 20 }} alt="email" />
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
