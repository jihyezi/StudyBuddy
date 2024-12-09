<<<<<<< HEAD
import React from "react";
import { Link } from "react-router-dom";
import styles from "./PostModal.module.css";

=======
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./PostModal.module.css";
import supabase from "components/supabaseClient";
>>>>>>> e0d8b202abfa26a4f19529701f2611576d619b6d
import community from "assets/icons/Sidebar/add_community.png";
import post from "assets/icons/Sidebar/add_post.png";
import study from "assets/icons/Sidebar/add_study.png";

<<<<<<< HEAD
const PostModal = ({ closeModal }) => {
=======
const fetchJoinCommunityData = async (userId) => {
  const { data, error } = await supabase
    .from("JoinCommunity")
    .select("*")
    .eq("userid", userId);

  if (error) throw new Error(error.message);
  return data;
};

const PostModal = ({ closeModal }) => {
  const [hasJoinedCommunity, setHasJoinedCommunity] = useState(false);

  const checkJoinCommunity = async () => {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    const userId = session.user.id;

    if (userId) {
      const communities = await fetchJoinCommunityData(userId);
      setHasJoinedCommunity(communities.length > 0);
    }
  };

  useEffect(() => {
    checkJoinCommunity();
  }, []);

  const handlePostClick = () => {
    if (!hasJoinedCommunity) {
      alert("가입하신 커뮤니티가 없습니다. 가입 후 게시물 작성 부탁드립니다.");
    }
  };
>>>>>>> e0d8b202abfa26a4f19529701f2611576d619b6d
  return (
    <div className={styles.overlay} onClick={closeModal}>
      <div className={styles.postModal}>
        <Link
<<<<<<< HEAD
          to="/create-post"
          className={styles.postItems}
          onClick={closeModal}
=======
          to={hasJoinedCommunity ? "/create-post" : "/communities"}
          className={styles.postItems}
          onClick={() => {
            handlePostClick();
            if (hasJoinedCommunity) closeModal();
          }}
>>>>>>> e0d8b202abfa26a4f19529701f2611576d619b6d
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
