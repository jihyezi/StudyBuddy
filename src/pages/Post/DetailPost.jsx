import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./DetailPost.module.css";
import supabase from "components/supabaseClient";
import { useLocation } from "react-router-dom";

// component
import Header from "components/Post/DetailHeader";
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
  const { postId } = useParams();
  const [inputValue, setInputValue] = useState("");
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [userData, setUserData] = useState(null);
  const [postData, setPostData] = useState(null);
  const [communityData, setCommunityData] = useState(null);
  const [commentData, setCommentData] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const postInfo = location.state;

  const handleReviseClick = () => {
    navigate(
      `/revisepost?postData=${encodeURIComponent(JSON.stringify(postData))}`
    );
  };

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

  useEffect(() => {
    const fetchPostDataById = async (postId) => {
      const { data, error } = await supabase
        .from("Post")
        .select("*")
        .eq("postid", postId);

      if (error) {
        console.error("Error fetching post data:", error);
        return;
      }
      setPostData(data[0]);
    };

    const fetchCommentDataById = async (postId) => {
      const { data, error } = await supabase
        .from("Comment")
        .select("*")
        .eq("postid", postId);

      if (error) {
        console.error("Error fetching comment data:", error);
        return;
      }
      setCommentData(data || []);
    };

    if (postInfo?.postid) {
      fetchPostDataById(postInfo.postid);
      fetchCommentDataById(postInfo.postid);
    }
  }, [postInfo]);

  useEffect(() => {
    const getPostData = async () => {
      const data = await fetchPostDataById(postId);
      // setPostData(data);

      const communityData = await fetchCommunityDataById(data.communityid);
      setCommunityData(communityData);

      const commentData = await fetchCommentDataById(data.postid);
      // setCommentData(commentData);

      const userData = await fetchUserDataById(data.userid);
      setUserData(userData);
    };

    const checkLikeAndBookmark = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Error getting session:", sessionError);
        return;
      }

      const userId = session.user.id;

      const { data: likeData } = await supabase
        .from("PostLike")
        .select("*")
        .eq("postid", postId)
        .eq("userid", userId);
      setLiked(likeData.length > 0);

      const { data: bookmarkData } = await supabase
        .from("Bookmark")
        .select("*")
        .eq("postid", postId)
        .eq("userid", userId);
      setBookmarked(bookmarkData.length > 0);
    };

    getPostData();
    checkLikeAndBookmark();
  }, [postId]);

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
      await supabase.from("PostLike").delete().eq("postid", postId);
      setLiked(false);
    } else {
      await supabase.from("PostLike").insert([
        {
          postid: postId,
          createdat: new Date(),
          userid: userId,
        },
      ]);
      setLiked(true);
    }
  };

  const toggleBookmark = async () => {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError) {
      console.error("Error getting session:", sessionError);
      return;
    }

    const userId = session.user.id;

    if (bookmarked) {
      await supabase.from("Bookmark").delete().eq("postid", postId);
      setBookmarked(false);
    } else {
      await supabase.from("Bookmark").insert([
        {
          postid: postId,
          createdat: new Date(),
          userid: userId,
          communityid: communityData.communityid,
        },
      ]);
      setBookmarked(true);
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

    const { data, error } = await supabase.from("Comment").insert([
      {
        postid: postData.postid,
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

      const commentData = await fetchCommentDataById(postData.postid);
      if (commentData) {
        setCommentData(commentData);
      }

      setInputValue("");
    }
  };

  if (!postData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header title={"Post"} />
      <div
        style={{ marginTop: "60px", marginLeft: "100px", marginRight: "300px" }}
      >
        <div className={styles.studiesStatus}>{postData.name}</div>
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
            src={postInfo.userimg}
            alt="profile1"
          />
          <div className={styles.postWriterNickname}>
            {postInfo.usernickname}
          </div>

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
          <div className={styles.revise} onClick={handleReviseClick}>
            수정
          </div>
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
              {new Date(postData.enddate).toLocaleDateString()} ({postInfo.day}
              일)
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
                onClick={() => downloadFile(postData.url, postData.filename)}
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
                className={styles.bookmarkIcon}
                src={bookmarked ? bookmarkOn : bookmarkOff}
                alt="bookmark"
                onClick={toggleBookmark}
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
              style={{ display: "flex", flexDirection: "column", gap: "40px" }}
            >
              {commentData.length > 0 ? (
                <>
                  {commentData[0] && (
                    <Comment
                      userid={commentData[0].userid}
                      content={commentData[0].content}
                      commentData={commentData[0]}
                    />
                  )}
                  {commentData[1] && (
                    <Comment
                      userid={commentData[1].userid}
                      content={commentData[1].content}
                      commentData={commentData[1]}
                    />
                  )}
                </>
              ) : (
                <div>No comments available</div>
              )}
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
                src={postInfo.userimg}
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
export default DetailPost;
