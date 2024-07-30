import React, { useEffect, useState, useRef } from "react";
import styles from "./Header.module.css";
import "fonts/Font.css";

// icon
import back from "assets/icons/Communities/back.png";

const Header = ({}) => {
  return (
    <div className={styles.header}>
      <img className={styles.backIcon} src={back} alt="back" />
      <span className={styles.headerName}>Explore</span>
    </div>
  );
};
export default Header;