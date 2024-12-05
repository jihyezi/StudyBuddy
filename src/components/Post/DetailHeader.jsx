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

  const StudyBtn = () => {
    navigate(`/studies`)
  }

  const CommunityBtn = () => {
    navigate(`/communities`)
  }

  return (
    <div className={styles.header}>
      <img
        className={styles.backIcon}
        src={back}
        alt="back"
        onClick={
          props.detailStudy
            ? StudyBtn
            : props.detailCommunity
              ? CommunityBtn
              : backBtn
        }
      />
      <div className={styles.headerName}>{props.title}</div>
      <div className={styles.rightSection}></div>
    </div>
  );
};
export default Header;
