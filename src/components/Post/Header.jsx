import React from "react";
import styles from "./Header.module.css";
import "fonts/Font.css";

// icon
import back from "assets/icons/Communities/back.png";

const Header = (props) => {
  return (
    <div className={styles.header}>
      <img className={styles.backIcon} src={back} alt="back" />
      <div className={styles.headerName}>{props.title}</div>
      <div className={styles.rightSection}>
        <div className={styles.cancel}>취소</div>
        <div className={styles.post}>등록</div>
      </div>
    </div>
  );
};
export default Header;
