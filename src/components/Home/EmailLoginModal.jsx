import React, { useState } from "react";
import Modal from "react-modal";
import styles from "./EmailLoginModal.module.css"; // 스타일을 CSS 모듈로 가져오기

import close from "assets/icons/Home/close.png";
import emailloginimg from "assets/images/Home/emailloginimg.png";
import passwordicon from "assets/icons/Home/password.png";
import SignUpModal from "./SignUpModal"; // SignUpModal 가져오기
import supabase from "../supabaseClient"; // supabase 클라이언트 가져오기
// 로그인
const customStyles = {
  content: {
    width: "520px",
    height: "580px",
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
Modal.setAppElement("#root");

const EmailLoginModal = ({ modalIsOpen, closeModal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [signUpModalIsOpen, setSignUpModalIsOpen] = useState(false); // 회원가입 모달 상태
  const [error, setError] = useState(""); // 오류 상태 추가

  const handleLogin = async () => {
    const { user, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("Login error:", error.message);
      setError("로그인 실패: " + error.message); // 오류 상태 업데이트
    } else {
      console.log("로그인 성공:", user);
      closeModal(); // 모달 닫기
      // 로그인 성공 후 상태 업데이트 또는 리다이렉션 처리
    }
  };

  const navigateToFindAccount = () => {
    // window.location.href = "/find-account"; // 계정 찾기 페이지로 이동
  };

  const navigateToFindPassword = () => {
    // window.location.href = "/find-password"; // 비밀번호 찾기 페이지로 이동
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const openSignUpModal = () => {
    setSignUpModalIsOpen(true);
  };

  const closeSignUpModal = () => {
    setSignUpModalIsOpen(false);
  };

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="이메일 로그인 모달"
      >
        <div className={styles.modalHeader}>
          <button onClick={closeModal} className={styles.closeButton}>
            <img src={close} alt="close" />
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.modalImageContainer}>
            <img src={emailloginimg} className={styles.ModalImg} />
          </div>
          <div className={styles.formContainer}>
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.inputField}
            />
            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.inputField}
              />
              <img
                src={passwordicon}
                alt="Show password"
                onClick={toggleShowPassword}
                className={styles.passwordIcon}
              />
            </div>
            <div style={{ paddingTop: 15 }}>
              <button onClick={handleLogin} className={styles.loginButton}>
                로그인
              </button>
            </div>
            <div className={styles.linksContainer}>
              <span onClick={navigateToFindAccount} className={styles.linkText}>
                계정 찾기
              </span>
              <div className={styles.textdev} />
              <span
                onClick={navigateToFindPassword}
                className={styles.linkText}
              >
                비밀번호 찾기
              </span>
            </div>
            <div className={styles.SignUpContainer}>
              <div className={styles.SignUptext}>
                아직 StudyBuddy를 사용하고 있지 않으신가요?
              </div>
              <span onClick={openSignUpModal} className={styles.linkText}>
                가입하기
              </span>
            </div>
          </div>
        </div>
      </Modal>
      <SignUpModal
        modalIsOpen={signUpModalIsOpen}
        closeModal={closeSignUpModal}
      />
    </>
  );
};

export default EmailLoginModal;
