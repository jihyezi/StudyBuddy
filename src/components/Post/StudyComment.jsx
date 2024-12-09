import React, { useEffect, useState, useRef } from "react";
import styles from "./Comment.module.css";
import supabase from "components/supabaseClient";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

// icon & image
import more from "assets/icons/Communities/more.png";
import profile1 from "assets/images/Profile/profile1.png";
import noprofile from "assets/images/Profile/noprofile.png";
import editIcon from "assets/icons/Post/edit.png";
import deleteIcon from "assets/icons/Post/delete.png";
import loadinggif from "assets/images/loading.gif";

const fetchPostCommentData = async ({ studyId, commentId }) => {
  const { data, error } = await supabase
    .from("StudyComment")
    .select("*")
    .eq("studyid", studyId)
    .eq("commentid", commentId);

  if (error) throw new Error(error.message);
  return data;
};

const fetchAllUserData = async (userId) => {
  const { data, error } = await supabase
    .from("User")
    .select("*")
    .eq("userid", userId)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

const StudyComment = ({ comment, studyId, commentId, userData, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [commentText, setCommentText] = useState(comment.content);
  const [editedText, setEditedText] = useState(comment.content);

  const {
    data: studyComments = [],
    isLoading: isPostCommentLoading,
    refetch: refetchComment,
  } = useQuery({
    queryKey: ["studyComments", { studyId, commentId }],
    queryFn: () => fetchPostCommentData({ studyId, commentId }),
    onError: (error) => console.log(error.message),
  });

  const { data: allUser, refetch } = useQuery({
    queryKey: ["allUser", comment.userid],
    queryFn: () => fetchAllUserData(comment.userid),
    enabled: false,
    onError: (error) => console.log(error.message),
  });

  useEffect(() => {
    if (isEditing === false) {
      refetch();
    }
  }, [isEditing, refetch]);

  useEffect(() => {
    if (showOptions) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showOptions, studyComments, studyId, commentId]);

  const moreClick = (event) => {
    event.stopPropagation();
    setShowOptions(!showOptions);
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest(".more-button-container")) {
      setShowOptions(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setShowOptions(false);
    setEditedText(commentText);
  };

  const handleDeleteClick = async () => {
    const { data, error } = await supabase
      .from("StudyComment")
      .delete()
      .eq("commentid", comment.commentid);

    if (error) {
      console.error("Error updating comment:", error);
    } else {
      onDelete(comment.commentid);
    }

    setShowOptions(false);
    refetchComment();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedText(commentText);
  };

  const handleRegister = async () => {
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

    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 9);
    const { data, error } = await supabase
      .from("StudyComment")
      .update({
        content: editedText,
        updatedat: currentDate,
      })
      .eq("commentid", comment.commentid);

    if (error) {
      console.error("Error updating comment:", error);
    } else {
      setCommentText(editedText);
      setIsEditing(false);
      refetchComment();
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds}초 전`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}분 전`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}시간 전`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}일 전`;
    } else if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months}개월 전`;
    } else {
      const years = Math.floor(diffInSeconds / 31536000);
      return `${years}년 전`;
    }
  };

  if (isPostCommentLoading) {
    return (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img src={loadinggif} style={{ width: "80px" }} alt="Loading..." />
      </div>
    );
  }

  return isEditing ? (
    <div className={styles.editClick}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          border: "2px solid #dddddd",
          borderRadius: "12px",
          padding: "10px",
          flex: 1,
        }}
      >
        <div
          style={{
            color: "#333333",
            fontFamily: "NotoSans-Medium",
            marginLeft: "15px",
            marginTop: "15px",
          }}
        >
          {allUser?.nickname || "닉네임"}
        </div>
        <textarea
          className={styles.inputField}
          value={editedText}
          placeholder="댓글을 입력하세요."
          onChange={(e) => setEditedText(e.target.value)}
        />
        <div className={styles.cancelAndRegister}>
          <div className={styles.cancel} onClick={handleCancel}>
            취소
          </div>
          <div className={styles.editRegister} onClick={handleRegister}>
            등록
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        position: "relative",
      }}
    >
      <div>
        <img
          className={styles.commentWriterProfile}
          src={allUser?.profileimage || noprofile}
          alt="noprofile"
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginLeft: "15px",
          gap: "5px",
          flex: 1,
          position: "relative",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className={styles.commentWriter}>
            <span className={styles.commentWriterNickname}>
              {allUser?.nickname || "닉네임"}
            </span>
            <span className={styles.commentWriterDate}>
              {formatDate(studyComments[0]?.updatedat) || "날짜 없음"}
            </span>
          </div>
          {userData && comment.userid === userData.userid && (
            <button className={styles.moreButton} onClick={moreClick}>
              <img className={styles.moreIcon} src={more} alt="more" />
            </button>
          )}
          {showOptions && (
            <div className={styles.moreClick}>
              <div className={styles.moreClickEdit} onClick={handleEditClick}>
                <div className={styles.moreClickEditText}>수정하기</div>
                <img
                  className={styles.moreClickEditIcon}
                  src={editIcon}
                  alt="edit"
                />
              </div>
              <div
                className={styles.moreClickDelete}
                onClick={handleDeleteClick}
              >
                <div className={styles.moreClickDeleteText}>삭제하기</div>
                <img
                  className={styles.moreClickDeleteIcon}
                  src={deleteIcon}
                  alt="delete"
                />
              </div>
            </div>
          )}
        </div>

        <div className={styles.comments}>{commentText}</div>
        {/* <div className={styles.reply}>답글달기</div> */}
      </div>
    </div>
  );
};

export default StudyComment;
