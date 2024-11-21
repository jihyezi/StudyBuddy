import React from "react";
import styles from "./Header.module.css";
import { useNavigate } from "react-router-dom";
import "fonts/Font.css";

// icon
import back from "assets/icons/Communities/back.png";
import addCommunity from "assets/icons/Communities/addCommunity.png";

const Header = ({ headerName }) => {

    const navigate = useNavigate();

    const backBtn = () => {
        navigate(-1);
    };

    const addCommunityButton = () => {
        navigate('/addCommunity');
    }

    return (
        <div className={styles.headerContainer}>
            <div className={styles.header}>
                <img className={styles.backIcon} onClick={backBtn} src={back} alt="back" />
                <span className={styles.headerName}>{headerName}</span>
            </div>
            {headerName === "My Communities" ? <img className={styles.backIcon} onClick={addCommunityButton} src={addCommunity} alt="back" />
                : null}
        </div>

    );
};
export default Header;
