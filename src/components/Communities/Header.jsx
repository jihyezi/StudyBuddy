import React, { useEffect, useState, useRef } from "react";
import styles from "./Header.module.css";
import "fonts/Font.css";

// icon
import back from "assets/icons/Communities/back.png";

const Header = ({ }) => {
  return (
    <div className={styles.header}>
      <img className={styles.backIcon} src={back} alt="back" />
      <span className={styles.headerName}>시각디자인기사</span>
    </div>
  );
};
export default Header;
