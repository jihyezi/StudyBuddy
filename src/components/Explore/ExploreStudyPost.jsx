import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ExploreStudyPost.module.css";
import supabase from "components/supabaseClient";

const StudyPost = (props) => {
  const navigate = useNavigate();
  const [userDataa, setUserDataa] = useState(null);

  const fetchUserDataById = async (userid) => {
    const { data, error } = await supabase
      .from("User")
      .select("profileimage, nickname")
      .eq("userid", userid);

    if (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
    return data[0];
  };

  const handlePostClick = () => {
    navigate(`/detail-study/${props.studyId}`, {
      state: {
        studyData: props.studyPost,
        userDataa: userDataa,
      },
    });
  };

  useEffect(() => {
    const getStudyData = async () => {
      const userData = await fetchUserDataById(props.studyPost.userid);
      setUserDataa(userData);
    };

    getStudyData();
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
      </div>
    </div>
  );
};

export default StudyPost;
