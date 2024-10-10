import React, { useState } from "react";
import Modal from "react-modal";
import styles from "./SignUpModal.module.css"; // 스타일을 CSS 모듈로 가져오기

import close from "assets/icons/Home/close.png";
import signUpimg from "assets/images/Home/signUpimg.png";
import passwordicon from "assets/icons/Home/password.png";
import rightarrow from "assets/icons/Home/rightarrow.png";
import red_error from "assets/icons/Home/red_error.svg";
import blue_error from "assets/icons/Home/blue_error.svg";
// import { createClient } from "@supabase/supabase-js";

import supabase from "components/supabaseClient";

const customStyles = {
  content: {
    width: "400px",
    height: "80%",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "30px",
    borderColor: "#fff",
    opacity: "1",
    overflow: "hidden",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.40)",
    zIndex: 1000,
  },
};
Modal.setAppElement("#root");

const SignUpModal = ({ modalIsOpen, closeModal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  //nickname
  const [nickname, setNickname] = useState("");
  const [nicknameMessage, setNicknameMessage] = useState("");
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);
  // email
  const [emailMessage, setEmailMessage] = useState("");
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);

  const [username, setUsername] = useState("");
  const [allChecked, setAllChecked] = useState(false);
  const [over14Checked, setOver14Checked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(""); // 에러 메시지 상태
  // password 중복
  const [confirmPasswordError, setConfirmPasswordError] = useState(""); // 비밀번호 확인 에러 상태

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
      setError("비밀번호가 일치하지 않습니다.");
      return;
    } else {
      setConfirmPasswordError("");
    }
    if (!allChecked || !over14Checked || !termsChecked || !privacyChecked) {
      setError("모든 동의 항목을 확인해주세요.");
      return;
    }

    // Supabase Auth를 사용하여 회원가입
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (signUpError) {
      console.error("회원가입 오류:", signUpError.message);
      setError("회원가입 실패: " + signUpError.message);
      return;
    } else {
      console.log("회원가입 완료 : ", data.user.id);
    }

    // 회원가입 후 추가 정보 저장
    const { error: dbError } = await supabase.from("User").insert([
      {
        userid: data.user.id,
        email: email,
        nickname: nickname,
        username: username,
        password: password,
        createdat: new Date(),
      },
    ]);

    if (dbError) {
      console.error("DB 저장 오류:", dbError.message);
      setError("회원가입 실패: " + dbError.message);
      return;
    }

    console.log("회원가입 성공:", data);
    closeModal(); // 모달 닫기
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

  const checkNicknameDuplicate = async (nickname) => {
    // 닉네임이 비어 있을 때는 중복 체크를 하지 않음
    if (nickname.trim().length === 0) {
      setNicknameMessage(""); // 메시지를 빈 값으로 설정
      setIsNicknameAvailable(false);
      return;
    }

    try {
      const { data: nicknameData, error } = await supabase
        .from("User")
        .select("*")
        .eq("nickname", nickname);

      if (error) {
        setNicknameMessage("닉네임 중복 확인 오류 발생");
        setIsNicknameAvailable(false);
        return;
      }

      if (nicknameData.length > 0) {
        setNicknameMessage("이미 존재하는 닉네임입니다.");
        setIsNicknameAvailable(false);
      } else {
        setNicknameMessage("사용 가능한 닉네임입니다.");
        setIsNicknameAvailable(true);
      }
    } catch (error) {
      setNicknameMessage("오류 발생: " + error.message);
      setIsNicknameAvailable(false);
    }
  };

  const handleNicknameChange = (e) => {
    const value = e.target.value;
    setNickname(value);

    if (value.trim().length === 0) {
      setNicknameMessage(""); // 닉네임이 없을 때 메시지를 빈 값으로 설정
      return;
    }

    checkNicknameDuplicate(value); // 닉네임 중복 확인
  };

  const checkEmailDuplicate = async (email) => {
    // 이메일이 비어 있을 때는 중복 체크를 하지 않음
    if (!email.trim()) {
      setEmailMessage(""); // 메시지를 빈 값으로 설정
      setIsEmailAvailable(false);
      return;
    }

    try {
      const { data: emailData, error } = await supabase
        .from("User")
        .select("*")
        .eq("email", email);

      if (error) {
        setEmailMessage("이메일 중복 확인 오류 발생");
        setIsEmailAvailable(false);
        return;
      }

      if (emailData.length > 0) {
        setEmailMessage("이미 존재하는 계정입니다.");
        setIsEmailAvailable(false);
      } else {
        setEmailMessage("사용 가능한 계정입니다.");
        setIsEmailAvailable(true);
      }
    } catch (error) {
      setEmailMessage("오류 발생: " + error.message);
      setIsEmailAvailable(false);
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    checkEmailDuplicate(value); // 이메일 중복 확인
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
          <img src={close} alt="close" className={styles.btn} />
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
            onChange={handleNicknameChange}
            className={styles.inputField}
          />
          {nicknameMessage && (
            <div className={styles.errorContainer}>
              <img
                src={isNicknameAvailable ? blue_error : red_error}
                alt={isNicknameAvailable ? "닉네임 사용 가능" : "닉네임 중복"}
              />
              <p
                className={styles.nicknameMessage}
                style={{
                  color: isNicknameAvailable ? "#74A3FF" : "#FF7474",
                }}
              >
                {nicknameMessage}
              </p>
            </div>
          )}
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={handleEmailChange}
            className={styles.inputField}
          />
          {emailMessage && (
            <div className={styles.errorContainer}>
              <img
                src={isEmailAvailable ? blue_error : red_error}
                alt={isEmailAvailable ? "이메일 사용 가능" : "이메일 중복"}
              />
              <p
                className={styles.nicknameMessage}
                style={{
                  color: isEmailAvailable ? "#74A3FF" : "#FF7474",
                }}
              >
                {emailMessage}
              </p>
            </div>
          )}
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
          {confirmPasswordError && (
            <div className={styles.errorContainer}>
              <img
                src={red_error} // 에러 아이콘은 항상 red_error 사용
                alt="비밀번호가 일치하지 않습니다."
              />
              <p
                className={styles.nicknameMessage}
                style={{ color: "#FF7474" }}
              >
                {confirmPasswordError} {/* 비밀번호 불일치 메시지 */}
              </p>
            </div>
          )}
          {/* {error && <div className={styles.error}>{error}</div>} */}

          <div className={styles.checkboxContainer}>
            <div className={styles.checkboxItem}>
              <input
                type="checkbox"
                checked={allChecked}
                onChange={handleAllChecked}
              />
              <label className={styles.labeltext}>모두 동의합니다</label>
            </div>
            <div style={{ width: 300, border: "1px solid #DDD" }} />
            <div className={styles.checkboxItem}>
              <input
                type="checkbox"
                checked={over14Checked}
                onChange={handleCheckboxChange(setOver14Checked)}
              />
              <label className={styles.labeltext}>만 14세 이상입니다</label>
            </div>
            <div className={styles.checkboxItem}>
              <input
                type="checkbox"
                checked={termsChecked}
                onChange={handleCheckboxChange(setTermsChecked)}
              />
              <label className={styles.labeltext}>[필수] 이용약관 동의</label>
              <img src={rightarrow} alt="Right arrow" className={styles.icon} />
            </div>
            <div className={styles.checkboxItem}>
              <input
                type="checkbox"
                checked={privacyChecked}
                onChange={handleCheckboxChange(setPrivacyChecked)}
              />
              <label className={styles.labeltext}>
                [필수] 개인정보 수집 및 이용 동의
              </label>
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
