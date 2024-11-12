import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StudyPost.module.css";
import supabase from "components/supabaseClient";
import { useAuth } from "contexts/AuthContext";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

import heart_off from "assets/icons/favorite_off.png";
import heart_on from "assets/icons/favorite_on.png";
import comment from "assets/icons/comment.png";
import share from "assets/icons/share.png";
import person from "assets/icons/person.png";
import loadinggif from "assets/images/loading.gif";

const fetchStudyLikeData = async (studyId) => {
  const { data, error } = await supabase
    .from("StudyLike")
    .select("*")
    .eq("studyid", studyId);

  if (error) throw new Error(error.message);
  return data;
};

const fetchStudyCommentData = async (studyId) => {
  const { data, error } = await supabase
    .from("StudyComment")
    .select("*")
    .eq("studyid", studyId);

  if (error) throw new Error(error.message);
  return data;
};

const StudyPost = (props) => {
  const [liked, setLiked] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: studyLike = [], isLoading: isLikeLoading } = useQuery({
    queryKey: ["studyLike", props.study.studyid],
    queryFn: () => fetchStudyLikeData(props.study.studyid),
    onError: (error) => console.log(error.message),
  });

  const { data: studyComment = [], isLoading: isCommentLoading } = useQuery({
    queryKey: ["studyComment", props.study.studyid],
    queryFn: () => fetchStudyCommentData(props.study.studyid),
    onError: (error) => console.log(error.message),
  });

  useEffect(() => {
    const checkLike = () => {
      const userLike = studyLike.find(
        (like) =>
          like.userid === props.userData.userid &&
          like.studyid === props.study.studyid
      );
      setLiked(!!userLike);
    };
    if (props.userData) {
      checkLike();
    }
  }, [studyLike]);

  const handlePostClick = () => {
    navigate(`/detail-study/${props.study.studyid}`);
  };

  const mutation = useMutation({
    mutationFn: async (newLike) => {
      const { data, error } = liked
        ? await supabase
            .from("StudyLike")
            .delete()
            .eq("studyid", props.study.studyid)
            .eq("userid", newLike.userid)
        : await supabase.from("StudyLike").insert([newLike]);
      if (error) {
        console.error("Error on mutation:", error.message);
        throw new Error(error.message);
      }

      console.log("Inserted data:", data);
      return data;
    },
    onMutate: async (newLike) => {
      await queryClient.cancelQueries(["studyLike", props.study.studyid]);

      const previousLike = queryClient.getQueryData([
        "studyLike",
        props.study.studyid,
      ]);

      console.log("onMutate liked", liked);
      if (liked) {
        queryClient.setQueryData(["studyLike", props.study.studyid], (old) =>
          old.filter((like) => like.userid !== newLike.userid)
        );
      } else {
        queryClient.setQueryData(["studyLike", props.study.studyid], (old) => [
          ...old,
          { ...newLike, createdat: new Date().toISOString() },
        ]);
      }

      return { previousLike };
    },
    onError: (err, newLike, context) => {
      queryClient.setQueryData(
        ["studyLike", props.study.studyid],
        context.previousLike
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(["studyLike", props.study.studyid]);
    },
  });

  const toggleLike = async (event) => {
    event.stopPropagation();

    if (!props.userData) {
      alert("로그인 후에 좋아요를 클릭할 수 있습니다.");
      return;
    }

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError) {
      console.error("Error getting session:", sessionError);
      return;
    }

    const userId = session.user.id;

    const newLike = {
      studyid: props.study.studyid,
      createdat: new Date(),
      userid: userId,
    };
    mutation.mutate(newLike);
    setLiked((prevLiked) => !prevLiked);
  };

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

  const loading = isLikeLoading || isCommentLoading;

  return (
    <div className={styles.StudyPostContainer}>
      {loading ? (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100vh",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={loadinggif} style={{ width: "80px" }} alt="Loading" />
        </div>
      ) : (
        <div className={styles.StudyPostWrapper} onClick={handlePostClick}>
          <div className={styles.StudyPostTitleContainer}>
            {props.study.completion === "모집 중" ? (
              <div className={styles.StudyPostState}>모집 중</div>
            ) : (
              <div className={styles.StudyPostState2}>모집완료</div>
            )}
            <div className={styles.StudyPostTitle}>{props.study.title}</div>
          </div>
          <div className={styles.StudyPostDescription}>
            {props.study.description.split("\n")[0]}
          </div>
          <div className={styles.StudyPostTags}>
            {props.study.tag.map((tag, index) => (
              <div key={index} className={styles.StudyPostTag}>
                {tag}
              </div>
            ))}
          </div>

          <div className={styles.StudyPostFooter}>
            <div className={styles.StudyPostIconGroup}>
              <div className={styles.StudyPostIcon}>
                <img src={person} alt="person" />
                <div
                  style={{ color: "#606060", fontSize: 12, fontWeight: 500 }}
                >
                  {props.study.maxmembers}
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
                {props.study.proceed}
              </div>
            </div>
            <div className={styles.StudyPostIconGroup}>
              <div className={styles.StudyPostIcon}>
                <img
                  className={styles.heartIcon}
                  src={liked ? heart_on : heart_off}
                  alt="heart_off"
                  onClick={toggleLike}
                />
                <span>{studyLike.length}</span>
              </div>
              <div className={styles.StudyPostIcon}>
                <img src={comment} alt="comment" />
                <span>{studyComment.length}</span>
              </div>
              <div className={styles.StudyPostIcon} onClick={handleShare}>
                <img className={styles.shareIcon} src={share} alt="share" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPost;
