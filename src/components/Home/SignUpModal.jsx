import React, { useState } from "react";
import Modal from "react-modal";
import styles from "./SignUpModal.module.css"; // 스타일을 CSS 모듈로 가져오기

import close from "assets/icons/Home/close.png";
import signUpimg from "assets/images/Home/signUpimg.png";
import passwordicon from "assets/icons/Home/password.png";
import rightarrow from "assets/icons/Home/rightarrow.png";
import supabase from "components/supabaseClient";

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
  const [username, setUsername] = useState("");
  const [allChecked, setAllChecked] = useState(false);
  const [over14Checked, setOver14Checked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(""); // 에러 메시지 상태
  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!allChecked || !over14Checked || !termsChecked || !privacyChecked) {
      setError("모든 동의 항목을 확인해주세요.");
      return;
    }
  
    try {
      // 이메일 및 사용자 이름 중복 체크
      const { data: existingUser } = await supabase
        .from("users")
        .select("email, username")
        .or(`email.eq.${email},username.eq.${username}`)
        .single();
  
      if (existingUser) {
        if (existingUser.email === email) {
          setError("이미 등록된 이메일입니다.");
        } else if (existingUser.username === username) {
          setError("이미 사용 중인 사용자 이름입니다.");
        }
        return;
      }
  
      // 회원가입 처리
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
  
      if (signUpError) {
        console.error("회원가입 오류:", signUpError.message);
        setError("회원가입 실패: " + signUpError.message);
        return;
      }
  
      // 추가 정보 저장
      const { data: session } = await supabase.auth.getSession();
      const currentUserId = session?.user?.id;
  
      if (!currentUserId) {
        setError("유저 정보를 불러오는 중 오류가 발생했습니다.");
        return;
      }
  
      const { error: dbError } = await supabase.from("users").insert([
        {
          userid: currentUserId,
          email: email,
          nickname: nickname,
          username: username,
          createdat: new Date().toISOString(),
        },
      ]);
  
      if (dbError) {
        console.error("DB 저장 오류:", dbError.message);
        setError("회원가입 실패: " + dbError.message);
        return;
      }
  
      console.log("회원가입 성공");
      closeModal(); // 모달 닫기
    } catch (error) {
      console.error("Unexpected error during sign-up:", error.message);
      setError("예기치 못한 오류 발생: " + error.message);
    }
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
          <input
            type="text"
            placeholder="사용자 이름"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

          {error && <div className={styles.error}>{error}</div>}

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