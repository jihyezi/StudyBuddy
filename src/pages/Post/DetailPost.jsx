import React, { useEffect, useState, useRef } from "react";
import styles from "./DetailPost.module.css";
import supabase from "components/supabaseClient";

// component
import Header from "components/Post/Header";
import DeleteModal from "components/Messages/DeleteModal";
import Comment from "components/Post/Comment";

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
  const [postData, setPostData] = useState(null);
  const [communityData, setCommunityData] = useState(null);
  const [commentData, setCommentData] = useState([]);
  const [showOptions, setShowOptions] = useState(false);

  const fetchPostDataById = async (postId) => {
    const { data, error } = await supabase
      .from("Post")
      .select("*")
      .eq("postid", postId);

    if (error) {
      console.error("Error fetching post data:", error);
      return null;
    }
    return data[0];
  };

  const fetchCommunityDataById = async (communityId) => {
    const { data, error } = await supabase
      .from("Community")
      .select("*")
      .eq("communityid", communityId);

    if (error) {
      console.error("Error fetching post data:", error);
      return null;
    }
    return data[0];
  };

  const fetchCommentDataById = async (postId) => {
    const { data, error } = await supabase
      .from("Comment")
      .select("*")
      .eq("postid", postId);

    if (error) {
      console.log("Error fetching comment data:", error);
      return null;
    }
    return data;
  };

  const fetchUserDataById = async () => {
    const { data, error } = await supabase.from("User").select("*");

    if (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
    return data;
  };

  useEffect(() => {
    const getPostData = async () => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        console.log("user", session.user);
        console.log(fetchUserDataById());
        // setUserId(session.user.id);
      });

      // const data = await fetchPostDataById(9);
      // setPostData(data);

      // const communityData = await fetchCommunityDataById(data.communityid);
      // setCommunityData(communityData);

      // const commentData = await fetchCommentDataById(data.postid);
      // setCommentData(commentData);
    };

    getPostData();
  }, []);

  if (!postData) {
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

  const downloadFile = async (url, filename) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("네트워크 응답이 좋지 않습니다.");
      }
      const blob = await response.blob();
      const a = document.createElement("a");
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("파일 다운로드 중 오류 발생:", error);
    }
  };

  const registerClick = async (event) => {
    const inputValue = document.querySelector(`.${styles.inputField}`).value;

    const { data, error } = await supabase.from("Comment").insert([
      {
        postid: postData.postid,
        userid: 7,
        content: inputValue,
        createdat: new Date(),
        updatedat: new Date(),
      },
    ]);

    if (error) {
      console.error("Error inserting comment:", error);
    } else {
      console.log("Comment inserted:", data);
    }
  };

  return (
    <div>
      <Header title={"Studies"} />
      <div
        style={{ marginTop: "60px", marginLeft: "100px", marginRight: "300px" }}
      >
        <div className={styles.studiesStatus}>{communityData?.name}</div>
        <div className={styles.studiesTitle}>{postData.title}</div>
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
            {new Date(postData.createdat).toLocaleDateString()}
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
            <div className={styles.studiesDetailIndex}>준비기간</div>
            <div className={styles.studiesDetail}>
              {new Date(postData.startdate).toLocaleDateString()} ~{" "}
              {new Date(postData.enddate).toLocaleDateString()}
            </div>
          </div>
          <div className={styles.studiesDetails}>
            <div className={styles.studiesDetailIndex}>책</div>
            <div className={styles.studiesDetail}>{postData.book}</div>
          </div>
          <div className={styles.studiesDetails}>
            <div className={styles.studiesDetailIndex}>결과</div>
            <div className={styles.studiesDetail}>{postData.result}</div>
          </div>
        </div>
        <div style={{ marginTop: "70px" }}>
          <div className={styles.studiesIntro}>공부방법</div>
          <div style={{ padding: "30px 30px 30px 30px" }}>
            <div className={styles.studiesContent}>
              {formatDescription(postData.content)}
            </div>

            {postData.references.map((file, index) => (
              <div
                key={index}
                style={{
                  maxWidth: "400px",
                  display: "block",
                  border: "1px solid #dddddd",
                  borderRadius: "8px",
                  cursor: "pointer",
                  // padding: "10px",
                }}
                onClick={() => downloadFile(file.url, file.filename)}
              >
                <div className={styles.postDetailFile}>
                  <img
                    className={styles.folderIcon}
                    src={folder}
                    alt="folder"
                  />
                  <div className={styles.filename}>{file.filename}</div>
                  <img
                    className={styles.downloadIcon}
                    src={download}
                    alt="download"
                  />
                </div>
              </div>
            ))}
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
              <Comment
                userid={3}
                content={commentData[1].content}
                commentData={commentData[1]}
              />
              <Comment
                userid={5}
                content={commentData[0].content}
                commentData={commentData[0]}
              />
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
export default DetailPost;
