import React, { useEffect, useState, useRef } from "react";
import styles from "./Comment.module.css";
import supabase from "components/supabaseClient";

// icon & image
import more from "assets/icons/Communities/more.png";
import profile1 from "assets/images/Profile/profile1.png";
import profile2 from "assets/images/Profile/profile2.png";
import profile3 from "assets/images/Profile/profile3.png";
import profile4 from "assets/images/Profile/profile4.png";
import editIcon from "assets/icons/Post/edit.png";
import deleteIcon from "assets/icons/Post/delete.png";

const Comment = ({ userid, content, commentData, onDelete, userDataa }) => {
  const [userId, setUserId] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [commentText, setCommentText] = useState(content);
  const [comments, setComments] = useState([commentData]);
  const [editedText, setEditedText] = useState(commentData.content);

  const moreClick = (event) => {
    event.stopPropagation();
    setShowOptions(!showOptions);
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest(".more-button-container")) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    console.log("Comment_userData", userDataa);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session.user.id);
    });

    const fetchUserProfile = async () => {
      const { data, error } = await supabase
        .from("User")
        .select("profileimage, nickname, updatedat")
        .eq("userid", userid);

      if (error) {
        console.error("Error fetching user profile:", error);
      } else {
        console.log(data[0]);
        setUserProfile(data[0]);
      }
    };

    fetchUserProfile();
  }, [userid]);

  useEffect(() => {
    if (showOptions) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showOptions]);

  const handleEditClick = () => {
    setIsEditing(true);
    setShowOptions(false);
    setEditedText(commentText);
  };

  const handleDeleteClick = async () => {
    const { data, error } = await supabase
      .from("Comment")
      .delete()
      .eq("commentid", commentData.commentid);

    if (error) {
      console.error("댓글 삭제 실패:", error);
    } else {
      console.log("댓글 삭제 성공:", data);
      setCommentText("");
      onDelete(commentData.commentid);
    }

    setShowOptions(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedText(commentText);
  };

  const handleRegister = async () => {
    const { data, error } = await supabase
      .from("Comment")
      .update({
        content: editedText,
        updatedat: new Date(),
      })
      .eq("commentid", commentData.commentid);

    if (error) {
      console.error("Error updating comment:", error);
    } else {
      console.log("Comment updated successfully:", data);
      setCommentText(editedText);
      setIsEditing(false);
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
          {userProfile?.nickname || "닉네임"}
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
          src={userDataa ? userDataa.profileimage : profile1}
          alt="profile1"
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
              {userDataa ? userDataa.nickname : "닉네임"}
            </span>
            <span className={styles.commentWriterDate}>
              {userProfile?.updatedat
                ? formatDate(userProfile.updatedat)
                : "날짜 없음"}
            </span>
          </div>
          {userid === userId && (
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
        <div className={styles.reply}>답글달기</div>
      </div>
    </div>
  );
};

export default Comment;
