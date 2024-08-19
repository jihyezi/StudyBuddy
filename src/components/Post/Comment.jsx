import React, { useEffect, useState, useRef } from "react";
import styles from "./Comment.module.css";

// icon & image
import more from "assets/icons/Communities/more.png";
import profile1 from "assets/images/Profile/profile1.png";
import profile2 from "assets/images/Profile/profile2.png";
import profile3 from "assets/images/Profile/profile3.png";
import profile4 from "assets/images/Profile/profile4.png";
import editIcon from "assets/icons/Post/edit.png";
import deleteIcon from "assets/icons/Post/delete.png";

const Comment = ({ userid, content, commentData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [commentText, setCommentText] = useState(content);
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

  const handleCancel = () => {
    setIsEditing(false);
    setEditedText(commentText);
  };

  const handleRegister = () => {
    setCommentText(editedText);
    setIsEditing(false);
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
          이민형
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
          src={profile4}
          alt="profile4"
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
            <span className={styles.commentWriterNickname}>케리아</span>
            <span className={styles.commentWriterDate}>5분전</span>
          </div>
          {userid === 3 && (
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
              <div className={styles.moreClickDelete}>
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
