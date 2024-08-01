import React, { useEffect, useState, useRef } from "react";
import styles from "./DetailPost.module.css";

// component
import Header from "components/Communities/Header";

// icon & image
import more from "assets/icons/Communities/more.png";
import likeOff from "assets/icons/Communities/like_off.png";
import likeOn from "assets/icons/Communities/like_on.png";
import bookmarkOff from "assets/icons/Communities/bookmark_off.png";
import bookmarkOn from "assets/icons/Communities/bookmark_on.png";
import share from "assets/icons/Communities/share.png";
import profile1 from "assets/images/Profile/profile1.png";
import profile2 from "assets/images/Profile/profile2.png";
import profile3 from "assets/images/Profile/profile3.png";
import profile4 from "assets/images/Profile/profile4.png";
import folder from "assets/icons/Post/folder.png";
import download from "assets/icons/Post/file_download.png";
import editIcon from "assets/icons/Post/edit.png";
import deleteIcon from "assets/icons/Post/delete.png";

const DetailPost = ({}) => {
  const [showOptions, setShowOptions] = useState(false);

  const moreClick = (event) => {
    event.stopPropagation(); // 이벤트 버블링 방지
    setShowOptions(!showOptions);
    console.log(!showOptions);
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

  return (
    <div>
      <Header title={"Studies"} />
      <div
        style={{ marginTop: "60px", marginLeft: "100px", marginRight: "300px" }}
      >
        <div className={styles.studiesStatus}>시각디자인기사</div>
        <div className={styles.studiesTitle}>
          시각디자인기사 2주만에 실기 합격할 수 있었던 방법😊
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "14px",
            marginTop: "30px",
          }}
        >
          <img
            className={styles.postWriterProfile}
            src={profile1}
            alt="profile1"
          />
          <div className={styles.postWriterNickname}>페이커</div>
          <div className={styles.postWriteDate}>2024.05.29</div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: "14px",
            paddingBottom: "16px",
            borderBottom: "3px solid #dddddd",
          }}
        >
          <div className={styles.revise}>수정</div>
          <div className={styles.delete}>삭제</div>
        </div>
        <div
          style={{
            marginTop: "30px",
            display: "flex",
            flexDirection: "column",
            gap: "30px",
          }}
        >
          <div className={styles.studiesDetails}>
            <div className={styles.studiesDetailIndex}>준비기간</div>
            <div className={styles.studiesDetail}>2024.05.01 ~ 2024.05.31</div>
          </div>
          <div className={styles.studiesDetails}>
            <div className={styles.studiesDetailIndex}>책</div>
            <div className={styles.studiesDetail}>시각디자인기사 실기</div>
          </div>
          <div className={styles.studiesDetails}>
            <div className={styles.studiesDetailIndex}>결과</div>
            <div className={styles.studiesDetail}>합격</div>
          </div>
        </div>
        <div style={{ marginTop: "70px" }}>
          <div className={styles.studiesIntro}>공부방법</div>
          <div style={{ padding: "30px 30px 30px 30px" }}>
            <div className={styles.studiesContent}>
              <div>저는 우선 전공자입니다!~~ 해당 자료들로 공부했습니다!!</div>
            </div>
            <div
              style={{
                display: "inline-block",
                border: "1px solid #dddddd",
                borderRadius: "8px",
              }}
            >
              <div className={styles.postDetailFile}>
                <img className={styles.folderIcon} src={folder} alt="folder" />
                <div className={styles.filename}>시각디지안기사_실기1.pdf</div>
                <img
                  className={styles.downloadIcon}
                  src={download}
                  alt="download"
                />
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "70px" }}>
          <div className={styles.studiesComments}>
            <div className={styles.studiesComment}>댓글 3개</div>
            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              <img className={styles.likeIcon} src={likeOn} alt="like" />
              <img
                className={styles.bookmarkIcon}
                src={bookmarkOn}
                alt="bookmark"
              />
              <img className={styles.shareIcon} src={share} alt="share" />
            </div>
          </div>

          <div style={{ padding: "30px 30px 30px 30px" }}>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "40px" }}
            >
              <div style={{ display: "flex", flexDirection: "row" }}>
                <div>
                  <img
                    className={styles.commentWriterProfile}
                    src={profile2}
                    alt="profile2"
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "15px",
                    gap: "5px",
                  }}
                >
                  <div className={styles.commentWriter}>
                    <span className={styles.commentWriterNickname}>손흥민</span>
                    <span className={styles.commentWriterDate}>40분전</span>
                  </div>
                  <div className={styles.comments}>
                    스터디 참가하고 싶어요!!
                  </div>
                  <div className={styles.reply}>답글달기</div>
                </div>
              </div>

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
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div className={styles.commentWriter}>
                      <span className={styles.commentWriterNickname}>
                        케리아
                      </span>
                      <span className={styles.commentWriterDate}>5분전</span>
                    </div>
                    <button className={styles.moreButton} onClick={moreClick}>
                      <img className={styles.moreIcon} src={more} alt="more" />
                    </button>
                    {showOptions && (
                      <div className={styles.moreClick}>
                        <div className={styles.moreClickEdit}>
                          <div className={styles.moreClickEditText}>
                            수정하기
                          </div>
                          <img
                            className={styles.moreClickEditIcon}
                            src={editIcon}
                            alt="edit"
                          />
                        </div>
                        <div className={styles.moreClickDelete}>
                          <div className={styles.moreClickDeleteText}>
                            삭제하기
                          </div>
                          <img
                            className={styles.moreClickDeleteIcon}
                            src={deleteIcon}
                            alt="delete"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={styles.comments}>
                    정보처리기사 혼자 공부하기 힘들었는데... 저도 스터디
                    참가하고 싶어요!!!!!!
                  </div>
                  <div className={styles.reply}>답글달기</div>
                </div>
              </div>

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
                  <input
                    className={styles.inputField}
                    type="text"
                    placeholder="댓글을 입력하세요."
                  />
                  <div className={styles.cancelAndRegister}>
                    <div className={styles.cancel}>취소</div>
                    <div className={styles.editRegister}>등록</div>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: "50px",
              }}
            >
              <img
                className={styles.commentWriterProfile}
                src={profile3}
                alt="profile3"
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  border: "2px solid #dddddd",
                  borderRadius: "12px",
                  padding: "10px",
                  flex: 1,
                  marginLeft: "15px",
                }}
              >
                <input
                  className={styles.inputField}
                  type="text"
                  placeholder="댓글을 입력하세요."
                />
                <div className={styles.register}>등록</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DetailPost;
