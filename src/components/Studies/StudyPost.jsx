import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StudyPost.module.css";
import supabase from "components/supabaseClient";
import { useAuth } from "contexts/AuthContext";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useDataContext } from "api/DataContext";

import heart_off from "assets/icons/favorite_off.png";
import heart_on from "assets/icons/favorite_on.png";
import comment from "assets/icons/comment.png";
import share from "assets/icons/share.png";
import person from "assets/icons/person.png";
import loadinggif from "assets/images/loading.gif";

const fetchStudyData = async (studyId) => {
  const { data, error } = await supabase
    .from("Study")
    .select("*")
    .eq("studyid", studyId);

  if (error) throw new Error(error.message);
  return data;
};

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

const StudyPost = ({ studyId }) => {
  const [liked, setLiked] = useState(false);
  const { userData } = useDataContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: Study = [], isLoading: isStudyLoading } = useQuery({
    queryKey: ["Study", studyId],
    queryFn: () => fetchStudyData(studyId),
    onError: (error) => console.log(error.message),
  });

  const { data: studyLike = [], isLoading: isLikeLoading } = useQuery({
    queryKey: ["studyLike", studyId],
    queryFn: () => fetchStudyLikeData(studyId),
    staleTime: 0,
    refetchOnWindowFocus: true,
    onError: (error) => console.log(error.message),
  });

  const { data: studyComment = [], isLoading: isCommentLoading } = useQuery({
    queryKey: ["studyComment", studyId],
    queryFn: () => fetchStudyCommentData(studyId),
    onError: (error) => console.log(error.message),
  });

  useEffect(() => {
    console.log("fetchStudyData", Study, studyId);
    const checkLike = () => {
      const userLike = studyLike.find(
        (like) => like.userid === userData?.userid && like.studyid === studyId
      );
      setLiked(!!userLike);
    };
    if (userData) {
      checkLike();
    }
  }, [studyLike, userData, studyId]);

  const handlePostClick = () => {
    navigate(`/detail-study/${studyId}`);
  };

  const mutation = useMutation({
    mutationFn: async ({ newLike, liked }) => {
      const { data, error } = liked
        ? await supabase
            .from("StudyLike")
            .delete()
            .eq("studyid", studyId)
            .eq("userid", newLike.userid)
        : await supabase.from("StudyLike").insert([newLike]);

      if (error) {
        console.error("Error on mutation:", error.message);
        throw new Error(error.message);
      }

      return data;
    },
    onMutate: async ({ newLike, liked }) => {
      await queryClient.cancelQueries(["studyLike", studyId]);

      const previousLike = queryClient.getQueryData(["studyLike", studyId]);

      if (liked) {
        queryClient.setQueryData(["studyLike", studyId], (old) => {
          if (!old) return [];
          return old.filter((like) => like.userid !== newLike.userid);
        });
      } else {
        queryClient.setQueryData(["studyLike", studyId], (old) => {
          if (!old)
            return [{ ...newLike, createdat: new Date().toISOString() }];
          return [...old, { ...newLike, createdat: new Date().toISOString() }];
        });
      }

      return { previousLike };
    },
    onError: (err, { newLike }, context) => {
      queryClient.setQueryData(["studyLike", studyId], context.previousLike);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(["studyLike", studyId]);
    },
  });

  const toggleLike = async (event) => {
    event.stopPropagation();

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Error getting session:", sessionError);
      return;
    }

    if (!session) {
      alert("로그인이 필요합니다. 로그인 후 다시 시도해 주세요.");
      return;
    }

    const userId = session.user.id;

    const newLike = {
      studyid: studyId,
      createdat: new Date(),
      userid: userId,
    };

    mutation.mutate({ newLike, liked });
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

  const loading = isStudyLoading || isLikeLoading || isCommentLoading;

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
            {Study[0].completion === "모집 중" ? (
              <div className={styles.StudyPostState}>모집 중</div>
            ) : (
              <div className={styles.StudyPostState2}>모집완료</div>
            )}
            <div className={styles.StudyPostTitle}>{Study[0].title}</div>
          </div>
          <div className={styles.StudyPostDescription}>
            {Study[0].description.split("\n")[0]}
          </div>
          <div className={styles.StudyPostTags}>
            {Study[0].tag.map((tag, index) => (
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
                  {Study[0].maxmembers}
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
                {Study[0].proceed}
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
