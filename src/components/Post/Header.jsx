import React from "react";
import styles from "./Header.module.css";
import "fonts/Font.css";

// icon
import back from "assets/icons/Communities/back.png";
import { useNavigate } from "react-router-dom";

const Header = (props) => {
  const navigate = useNavigate();
  const backBtn = () => {
    navigate(-1);
  };

  return (
    <div className={styles.header}>
      <img
        className={styles.backIcon}
        src={back}
        alt="back"
        onClick={backBtn}
      />
      <div className={styles.headerName}>{props.title}</div>
      <div className={styles.rightSection}>
        <div className={styles.cancel} onClick={backBtn}>
          취소
        </div>
        <div className={styles.post} onClick={props.onPost}>
          등록
        </div>
      </div>
    </div>
  );
};
export default Header;
