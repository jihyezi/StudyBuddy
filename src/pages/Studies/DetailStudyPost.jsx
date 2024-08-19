import React, { useEffect, useState, useRef } from "react";
import styles from "./DetailStudyPost.module.css";
import supabase from "components/supabaseClient";

// component
import Header from "components/Post/Header";

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
  const [studyData, setStudyData] = useState(null);

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

  useEffect(() => {
    const getStudyData = async () => {
      const data = await fetchStudyDataById(6);
      setStudyData(data);
    };

    getStudyData();
  }, []);

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

  return (
    <div>
      <Header title={"Studies"} />
      <div
        style={{ marginTop: "60px", marginLeft: "100px", marginRight: "300px" }}
      >
        <div className={styles.studiesStatus}>모집 중</div>
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
            src={profile1}
            alt="profile1"
          />
          <div className={styles.postWriterNickname}>페이커</div>
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
          <div className={styles.studiesDetails}>
            <div className={styles.studiesDetailIndex}>장소</div>
            <div className={styles.studiesDetail}>{studyData.location}</div>
          </div>
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
            <div className={styles.studiesDetail}>주3회 1시</div>
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
            <div className={styles.studiesComment}>댓글 3개</div>
            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              <img className={styles.likeIcon} src={likeOn} alt="like" />
              <img className={styles.shareIcon} src={share} alt="share" />
            </div>
          </div>

          <div style={{ padding: "30px 30px 30px 30px" }}>
            <div>
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
            </div>
            <div style={{ marginTop: "50px" }}>
              <div style={{ display: "flex" }}>
                <img
                  className={styles.commentWriterProfile}
                  src={profile3}
                  alt="profile3"
                />
                <input
                  className={styles.inputField}
                  type="text"
                  placeholder="댓글을 입력하세요."
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "15px",
                }}
              >
                <div className={styles.register}>등록</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DetailStudyPost;
