import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import styles from "./DetailStudyPost.module.css";
import supabase from "components/supabaseClient";

// component
import Header from "components/Post/DetailHeader";
import Comment from "components/Post/Comment";

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

const DetailStudyPost = ({}) => {
  const { studyId } = useParams();
  const [inputValue, setInputValue] = useState("");
  const [userData, setUserData] = useState(null);
  const [studyData, setStudyData] = useState(null);
  const [commentData, setCommentData] = useState([]);
  const [liked, setLiked] = useState(false);

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
    const getStudyData = async () => {
      const data = await fetchStudyDataById(studyId);
      setStudyData(data);

      const commentData = await fetchCommentDataById(data.studyid);
      setCommentData(commentData);

      const userData = await fetchUserDataById(data.userid);
      setUserData(userData);
    };

    getStudyData();
  }, [studyId]);

  if (!studyData) {
    return <div>Loading...</div>;
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
    if (liked) {
      await supabase.from("PostLike").delete().eq("postId", "your_post_id");
      setLiked(false);
    } else {
      await supabase.from("PostLike").insert([{ postId: "your_post_id" }]);
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

  return (
    <div>
      <Header title={"Studies"} />
      <div
        style={{ marginTop: "60px", marginLeft: "100px", marginRight: "300px" }}
      >
        <div className={styles.studiesStatus}>{studyData.completion}</div>
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
            src={userData?.profileimage || profile1}
            alt="profile1"
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
                src={profile1}
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
