import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styles from "./DetailStudyPost.module.css";
import supabase from "components/supabaseClient";

// component
import Header from "components/Post/DetailHeader";
import Comment from "components/Post/Comment";
import DeleteModal from "components/Post/DeleteModal";

// icon & image
import more from "assets/icons/Communities/more.png";
import likeOff from "assets/icons/Communities/like_off.png";
import likeOn from "assets/icons/Communities/like_on.png";
import share from "assets/icons/Communities/share.png";
import profile1 from "assets/images/Profile/profile1.png";
import profile2 from "assets/images/Profile/profile2.png";
import profile3 from "assets/images/Profile/profile3.png";
import profile4 from "assets/images/Profile/profile4.png";
import image from "assets/images/Studies/studyIntroduce.png";
import loadinggif from "assets/images/loading.gif";
import noprofile from "assets/images/Profile/noprofile.png";

const DetailStudyPost = ({ }) => {
  const { studyId } = useParams();
  const [inputValue, setInputValue] = useState("");
  const [userData, setUserData] = useState(null);
  // const [studyData, setStudyData] = useState(null);
  const [commentData, setCommentData] = useState([]);
  const [liked, setLiked] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { studyData, userDataa } = location.state;

  console.log(userDataa);

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

  const fetchStudyDataById = async (studyId) => {
    const { data, error } = await supabase
      .from("Study")
      .select("*")
      .eq("studyid", studyId);

    if (error) {
      console.error("Error fetching study data:", error);
      return null;
    }
    console.log(data);
    return data[0];
  };

  const fetchCommentDataById = async (studyId) => {
    const { data, error } = await supabase
      .from("StudyComment")
      .select("*")
      .eq("studyid", studyId);

    if (error) {
      console.log("Error fetching comment data:", error);
      return null;
    }
    return data;
  };

  useEffect(() => {
    // console.log("userDataa", userDataa[0].userid);
    console.log("studyData", studyData.userid);

    const getStudyData = async () => {
      const data = await fetchStudyDataById(studyId);
      // setStudyData(data);

      const commentData = await fetchCommentDataById(data.studyid);
      setCommentData(commentData);

      const userData = await fetchUserDataById(data.userid);
      setUserData(userData);
    };

    getStudyData();

    const checkLike = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error getting session:", sessionError);
        return;
      }

      if (!session) {
        console.error("No session found. User might not be logged in.");
        return;
      }

      const userId = session.user.id;

      const { data: likeData } = await supabase
        .from("StudyLike")
        .select("*")
        .eq("studyid", studyData.studyid)
        .eq("userid", userId);
      setLiked(likeData.length > 0);
    };
    checkLike();
  }, [studyId]);

  if (!studyData) {
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
        <img src={loadinggif} style={{ width: "80px" }} />
      </div>
    );
  }

  const formatDescription = (description) => {
    const regex = /!\[Image\]\((.*?)\)/g;
    const parts = description.split("\n").flatMap((line, index) => {
      const imageParts = line.split(regex);
      return imageParts.map((part, i) => {
        if (i % 2 === 1) {
          return (
            <img key={i} src={part} alt="Image" className={styles.image} />
          );
        }
        return (
          <React.Fragment key={i}>
            {part}
            <br />
          </React.Fragment>
        );
      });
    });
    return parts;
  };

  const registerClick = async (event) => {
    if (!inputValue.trim()) return;

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError) {
      console.error("Error getting session:", sessionError);
      return;
    }

    const userId = session.user.id;
    const inputValues = document.querySelector(`.${styles.inputField}`).value;

    const { data, error } = await supabase.from("StudyComment").insert([
      {
        studyid: studyId,
        userid: userId,
        content: inputValues,
        createdat: new Date(),
        updatedat: new Date(),
      },
    ]);

    if (error) {
      console.error("Error inserting comment:", error);
    } else {
      console.log("Comment inserted:", data);

      const commentData = await fetchCommentDataById(studyId);
      if (commentData) {
        setCommentData(commentData);
      }

      setInputValue("");
    }
  };

  const toggleLike = async () => {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError) {
      console.error("Error getting session:", sessionError);
      return;
    }

    const userId = session.user.id;

    if (liked) {
      await supabase
        .from("StudyLike")
        .delete()
        .eq("studyid", studyData.studyid);
      setLiked(false);
    } else {
      await supabase.from("StudyLike").insert([
        {
          studyid: studyData.studyid,
          createdat: new Date(),
          userid: userId,
        },
      ]);
      setLiked(true);
    }
  };

  const handleShare = () => {
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

  const handleRemoveClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteClick = async () => {
    const { data, error } = await supabase
      .from("Study")
      .delete()
      .eq("studyid", studyData.studyid);

    if (error) {
      console.log("삭제 실패 : ", error);
    } else {
      console.log("삭제 성공 ");
      navigate(-1);
    }
  };

  const handleCancelClick = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <div>
      <Header title={"Studies"} />
      {isDeleteModalOpen && (
        <DeleteModal
          onDelete={handleDeleteClick}
          onCancel={handleCancelClick}
        />
      )}
      <div
        style={{ marginTop: "60px", marginLeft: "100px", marginRight: "300px" }}
      >
        {studyData.completion === "모집 중" ? (
          <div className={styles.studiesStatus}>{studyData.completion}</div>
        ) : (
          <div className={styles.studiesStatus2}>{studyData.completion}</div>
        )}
        <div className={styles.studiesTitle}>{studyData.title}</div>
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
            src={userData?.profileimage || noprofile}
            alt="noprofile"
          />
          <div className={styles.postWriterNickname}>{userData?.nickname}</div>
          <div className={styles.postWriteDate}>
            {new Date(studyData.createdat).toLocaleDateString()}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: "14px",
            paddingBottom: "16px",
            borderBottom: "3px solid #dddddd",
            width: '800px'
          }}
        >
          {/* {userDataa &&
          userDataa.length > 0 &&
          userDataa[0].userid === studyData.userid ? (
            <>
              <div
                className={styles.revise}
                // onClick={handleReviseClick}
              >
                수정
              </div>
              <div className={styles.delete} onClick={handleRemoveClick}>
                삭제
              </div>
            </>
          ) : (
            <>
              <div
                className={`${styles.revise} ${styles.disabled}`}
                title="로그인이 필요합니다"
              >
                수정
              </div>
              <div
                className={`${styles.delete} ${styles.disabled}`}
                title="로그인이 필요합니다"
              >
                삭제
              </div>
            </>
          )} */}
          {userDataa &&
            userDataa.length > 0 &&
            userDataa[0].userid === studyData.userid && (
              <>
                <div
                  className={styles.revise}
                // onClick={handleReviseClick}
                >
                  수정
                </div>
                <div className={styles.delete} onClick={handleRemoveClick}>
                  삭제
                </div>
              </>
            )}
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
            <div className={styles.studiesDetailIndex}>진행 방식</div>
            <div className={styles.studiesDetail}>{studyData.proceed}</div>
          </div>
          <div className={styles.studiesDetails}>
            <div className={styles.studiesDetailIndex}>모집인원</div>
            <div className={styles.studiesDetail}>{studyData.maxmembers}</div>
          </div>
          {studyData.location === null && (
            <div className={styles.studiesDetails}>
              <div className={styles.studiesDetailIndex}>장소</div>
              <div className={styles.studiesDetail}>{studyData.location}</div>
            </div>
          )}

          <div className={styles.studiesDetails}>
            <div className={styles.studiesDetailIndex}>기간</div>
            <div className={styles.studiesDetail}>{studyData.duration}</div>
          </div>
          <div className={styles.studiesDetails}>
            <div className={styles.studiesDetailIndex}>일정</div>
            <div className={styles.studiesDetail}>{studyData.schedule}</div>
          </div>
          <div className={styles.studiesDetails}>
            <div className={styles.studiesDetailIndex}>태그</div>
            {studyData.tag.map((tag, index) => (
              <div className={styles.studiesDetail}>{tag}</div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: "70px" }}>
          <div className={styles.studiesIntro}>스터디 소개</div>
          <div className={styles.studiesContent}>
            {formatDescription(studyData.description)}
          </div>
        </div>

        <div style={{ marginTop: "70px" }}>
          <div className={styles.studiesComments}>
            <div className={styles.studiesComment}>
              댓글 {commentData.length}개
            </div>
            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              <img
                className={styles.likeIcon}
                src={liked ? likeOn : likeOff}
                alt="like"
                onClick={toggleLike}
              />
              <img
                className={styles.shareIcon}
                src={share}
                alt="share"
                onClick={handleShare}
              />
            </div>
          </div>

          <div style={{ padding: "30px 30px 30px 30px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "40px",
              }}
            >
              {commentData &&
                commentData.length > 0 &&
                commentData.map((comment, index) => (
                  <Comment
                    key={index}
                    userid={comment.userid}
                    content={comment.content}
                    commentData={comment}
                    userDataa={userDataa}
                  />
                ))}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: "70px",
              }}
            >
              <img
                className={styles.commentWriterProfile}
                src={userDataa && userDataa.length > 0 ? userDataa[0].profileimage : noprofile}
                alt="noprofile"
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
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <div className={styles.register} onClick={registerClick}>
                  등록
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DetailStudyPost;
