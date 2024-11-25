import React from "react";
import { Link } from "react-router-dom";
import styles from "./PostModal.module.css";

import community from "assets/icons/Sidebar/add_community.png";
import post from "assets/icons/Sidebar/add_post.png";
import study from "assets/icons/Sidebar/add_study.png";

const PostModal = ({ closeModal }) => {
  return (
    <div className={styles.overlay} onClick={closeModal}>
      <div className={styles.postModal}>
        <Link
          to="/create-post"
          className={styles.postItems}
          onClick={closeModal}
        >
          <img
            style={{
              width: 24,
              height: 24,
            }}
            src={post}
            alt="icon"
          />
          <div className={styles.postItem}>게시물 작성</div>
        </Link>
        <Link
          to="/create-community"
          className={styles.postItems}
          onClick={closeModal}
        >
          <img
            style={{
              width: 24,
              height: 24,
            }}
            src={community}
            alt="icon"
          />
          <div className={styles.postItem}>커뮤니티 개설</div>
        </Link>
        <Link
          to="/create-study"
          className={styles.postItems}
          onClick={closeModal}
        >
          <img
            style={{
              width: 24,
              height: 24,
            }}
            src={study}
            alt="icon"
          />
          <div className={styles.postItem}>스터디 생성</div>
        </Link>
      </div>
    </div>
  );
};

export default PostModal;
