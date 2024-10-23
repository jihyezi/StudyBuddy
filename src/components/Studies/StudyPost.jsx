import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StudyPost.module.css";
import supabase from "components/supabaseClient";
import { useAuth } from "contexts/AuthContext";

import heart_off from "assets/icons/favorite_off.png";
import heart_on from "assets/icons/favorite_on.png";
import comment from "assets/icons/comment.png";
import share from "assets/icons/share.png";
import person from "assets/icons/person.png";

const StudyPost = (props) => {
  const navigate = useNavigate();
  const [userDataa, setUserDataa] = useState(null);
  const { user: sessionUser } = useAuth();

  const fetchUserData = async () => {
    if (sessionUser) {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Error getting session:", sessionError);
        return;
      }

      const userId = session.user.id;

      const { data, error } = await supabase
        .from("User")
        .select("*")
        .eq("userid", userId);

      if (error) {
        console.error("Error", error);
      } else {
        setUserDataa(data);
      }
    }
  };

  const handlePostClick = () => {
    navigate(`/detail-study/${props.studyId}`, {
      state: {
        studyData: props.studyPost,
        userDataa: userDataa,
      },
    });
  };

  console.log(JSON.stringify([props.studyPost]))
  console.log(JSON.stringify([userDataa]))


  const handleShare = (event) => {
    event.stopPropagation();

    if (navigator.share) {
      navigator
        .share({
          title: "공유할 제목",
          url: "your_post_url",
        })
        .then(() => console.log("공유 성공"))
        .catch((error) => console.log("공유 실패", error));
    } else {
      alert("공유 기능을 지원하지 않는 브라우저입니다.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className={styles.StudyPostContainer}>
      <div className={styles.StudyPostWrapper}>
        <div className={styles.StudyPostWrapperr} onClick={handlePostClick}>
          <div className={styles.StudyPostTitleContainer}>
            {props.completion === "모집 중" ? (
              <div className={styles.StudyPostState}>모집 중</div>
            ) : (
              <div className={styles.StudyPostState2}>모집완료</div>
            )}
            <div className={styles.StudyPostTitle}>{props.title}</div>
          </div>
          <div className={styles.StudyPostDescription}>{props.description}</div>
          <div className={styles.StudyPostTags}>
            {props.tag.map((tag, index) => (
              <div key={index} className={styles.StudyPostTag}>
                {tag}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.StudyPostFooter}>
          <div className={styles.StudyPostIconGroup}>
            <div className={styles.StudyPostIcon}>
              <img src={person} alt="person" />
              <div style={{ color: "#606060", fontSize: 12, fontWeight: 500 }}>
                {props.maxmembers}
              </div>
            </div>
            <div
              style={{
                width: 2,
                height: 2,

                background: "#606060",
                borderRadius: 25,
              }}
            />
            <div style={{ color: "#606060", fontSize: 12, fontWeight: 500 }}>
              {props.proceed}
            </div>
          </div>
          <div className={styles.StudyPostIconGroup}>
            <div className={styles.StudyPostIcon}>
              <img
                className={styles.heartIcon}
                src={heart_off}
                alt="heart_off"
              />
              <span>{props.likesCount}</span>
            </div>
            <div className={styles.StudyPostIcon}>
              <img src={comment} alt="comment" />
              <span>{props.commentsCount}</span>
            </div>
            <div className={styles.StudyPostIcon} onClick={handleShare}>
              <img className={styles.shareIcon} src={share} alt="share" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPost;
