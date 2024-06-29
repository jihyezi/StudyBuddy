import React, { useState } from "react";
import Modal from "react-modal";
import styles from "./SignUpModal.module.css"; // 스타일을 CSS 모듈로 가져오기

import close from "assets/icons/Home/close.png";
import signUpimg from "assets/images/Home/signUpimg.png";
import passwordicon from "assets/icons/Home/password.png";
import rightarrow from "assets/icons/Home/rightarrow.png";
const customStyles = {
  content: {
    width: "520px",
    height: "830px",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "30px",
    borderColor: "#fff",
    opacity: "1",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.40)",
  },
};
Modal.setAppElement("#root");

const SignUpModal = ({ modalIsOpen, closeModal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [allChecked, setAllChecked] = useState(false);
  const [over14Checked, setOver14Checked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = () => {
    // 회원가입 로직을 여기에 추가합니다
    console.log("Nickname:", nickname);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);
  };

  const handleAllChecked = () => {
    const newValue = !allChecked;
    setAllChecked(newValue);
    setOver14Checked(newValue);
    setTermsChecked(newValue);
    setPrivacyChecked(newValue);
  };

  const handleCheckboxChange = (setter) => (e) => {
    setter(e.target.checked);
    if (!e.target.checked) {
      setAllChecked(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="회원가입 모달"
    >
      <div className={styles.modalHeader}>
        <button onClick={closeModal} className={styles.closeButton}>
          <img src={close} alt="close" />
        </button>
      </div>
      <div className={styles.modalBody}>
        <div className={styles.modalImageContainer}>
          <img src={signUpimg} className={styles.ModalImg} />
        </div>
        <div className={styles.formContainer}>
          <input
            type="nickname"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className={styles.inputField}
          />
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
              placeholder="비밀번호 8 ~ 20자"
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
          <div className={styles.passwordContainer}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.inputField}
            />
            <img
              src={passwordicon}
              alt="Show password"
              onClick={toggleShowPassword}
              className={styles.passwordIcon}
            />
          </div>

          <div className={styles.checkboxContainer}>
            <div className={styles.checkboxItem}>
              <input
                type="checkbox"
                checked={allChecked}
                onChange={handleAllChecked}
              />
              <label>모두 동의합니다</label>
            </div>
            <div style={{ width: 345, border: "1px solid #DDD" }} />
            <div className={styles.checkboxItem}>
              <input
                type="checkbox"
                checked={over14Checked}
                onChange={handleCheckboxChange(setOver14Checked)}
              />
              <label>만 14세 이상입니다</label>
            </div>
            <div className={styles.checkboxItem}>
              <input
                type="checkbox"
                checked={termsChecked}
                onChange={handleCheckboxChange(setTermsChecked)}
              />
              <label>[필수] 이용약관 동의</label>
              <img src={rightarrow} alt="Right arrow" className={styles.icon} />
            </div>
            <div className={styles.checkboxItem}>
              <input
                type="checkbox"
                checked={privacyChecked}
                onChange={handleCheckboxChange(setPrivacyChecked)}
              />
              <label>[필수] 개인정보 수집 및 이용 동의</label>
              <img src={rightarrow} alt="Right arrow" className={styles.icon} />
            </div>
          </div>
          <div style={{ paddingTop: 15 }}>
            <button onClick={handleSignUp} className={styles.signUpButton}>
              회원가입
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SignUpModal;
