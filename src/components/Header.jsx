import React, { useEffect, useState, useRef } from "react";
import styles from "./Header.module.css";
import "fonts/Font.css";

// icon
import back from "assets/icons/Communities/back.png";
import { useNavigate } from "react-router-dom";

const Header = ({ headerName }) => {

    const navigate = useNavigate();
    const backBtn = () => {
        navigate(-1);
    }

    return (
        <div className={styles.header}>
            <img className={styles.backIcon} onClick={backBtn} src={back} alt="back" />
            <span className={styles.headerName}>{headerName}</span>
        </div>
    );
};
export default Header;