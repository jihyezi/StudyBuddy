import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styles from "./DetailPost.module.css";
import supabase from "components/supabaseClient";

// component
import Header from "components/Post/DetailHeader";
import DeleteModal from "components/Post/DeleteModal";
import Comment from "components/Post/Comment";

// icon & image
import more from "assets/icons/Communities/more.png";
import likeOff from "assets/icons/Communities/like_off.png";
import likeOn from "assets/icons/Communities/like_on.png";
import bookmarkOff from "assets/icons/Communities/bookmark_off.png";
import bookmarkOn from "assets/icons/Communities/bookmark_on.png";
import share from "assets/icons/Communities/share.png";
import folder from "assets/icons/Post/folder.png";
import download from "assets/icons/Post/file_download.png";
import editIcon from "assets/icons/Post/edit.png";
import deleteIcon from "assets/icons/Post/delete.png";
import noprofile from "assets/images/Profile/noprofile.png";

const DetailPost = ({ }) => {
  const [commentData, setCommentData] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { userData, allUserData, communityData, postData, thisPost } = location.state || {};

  const communityName = Array.isArray(communityData)
    ? communityData.find((comm) => comm.communityid === thisPost.communityid)
      ?.name
    : "Unknown Community";

  const communityid = Array.isArray(communityData)
    ? communityData.find((comm) => comm.communityid === thisPost.communityid)
      ?.communityid
    : "Unknown Community";

  const userid =
    Array.isArray(allUserData) && allUserData.length > 0
      ? allUserData.find((u) => u.userid === thisPost.userid)?.username
      : "Unknown User";

  const selectedUserData =
    Array.isArray(allUserData) && allUserData.length > 0
      ? allUserData.find((u) => u.userid === thisPost.userid) // postData.userid에 해당하는 사용자 데이터 찾기
      : null;



  const userimg =
    Array.isArray(allUserData) && allUserData.length > 0
      ? allUserData.find((u) => u.userid === thisPost.userid)?.profileimage
      : "Unknown User";

  const userNickname =
    Array.isArray(allUserData) && allUserData.length > 0
      ? allUserData.find((u) => u.userid === thisPost.userid)?.nickname
      : "Unknown User";

  const handleReviseClick = () => {
    navigate(
      `/revisepost?postData=${encodeURIComponent(JSON.stringify(thisPost))}`
    );
  };

  const handleRemoveClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteClick = async () => {
    const { data, error } = await supabase
      .from("Post")
      .delete()
      .eq("postud", thisPost.postid);

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

  useEffect(() => {
    const getCommentData = async () => {
      const commentData = await fetchCommentDataById(thisPost.postid);
      setCommentData(commentData);
    };
    getCommentData();
  }, []);

  useEffect(() => {
    const checkLikeAndBookmark = async () => {
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

      // 좋아요 유무
      const { data: likeData } = await supabase
        .from("PostLike")
        .select("*")
        .eq("postid", thisPost.postid)
        .eq("userid", userId);
      setLiked(likeData.length > 0);

      // 북마크 유무
      const { data: bookmarkData } = await supabase
        .from("Bookmark")
        .select("*")
        .eq("postid", thisPost.postid)
        .eq("userid", userId);
      setBookmarked(bookmarkData.length > 0);
    };
    checkLikeAndBookmark();
  }, [thisPost.postid]);

  const formatDescription = (description) => {
    console.log("filteredPost", thisPost);
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

  const toggleLike = async () => {
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

    if (liked) {
      await supabase.from("PostLike").delete().eq("postid", thisPost.postid);
      setLiked(false);
    } else {
      await supabase.from("PostLike").insert([
        {
          postid: thisPost.postid,
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

    if (!session) {
      alert("로그인이 필요합니다. 로그인 후 다시 시도해 주세요.");
      return;
    }

    const userId = session.user.id;

    if (bookmarked) {
      await supabase.from("Bookmark").delete().eq("postid", thisPost.postid);
      setBookmarked(false);
    } else {
      await supabase.from("Bookmark").insert([
        {
          postid: thisPost.postid,
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

    if (!session) {
      console.error("No session found. User might not be logged in.");
      return;
    }

    const userId = session.user.id;
    const inputValues = document.querySelector(`.${styles.inputField}`).value;

    const { data, error } = await supabase.from("Comment").insert([
      {
        postid: thisPost.postid,
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

      const commentData = await fetchCommentDataById(thisPost.postid);
      if (commentData) {
        setCommentData(commentData);
      }

      setInputValue("");
    }
  };

  const deleteComment = (commentId) => {
    setCommentData((prevComments) =>
      prevComments.filter((comment) => comment.commentid !== commentId)
    );
  };

  const handleCommunityClick = (item) => {
    navigate(`/detail-community/${item.communityid}`, {
      state: {
        // id: `${item.id}`,
        // img: `${item.img}`,
        // community: `${item.community}`,
        communityData: communityData,
        postData: postData,
        thisPost, thisPost,
        userData: userData,
        allUserData: allUserData
      },
    });
  };

  const handleProfileClick = (item) => {
    navigate(`/profile/${item}`);
  };

  return (
    <div style={{ width: "100%", maxWidth: "1200px", margin: "0" }}>
      <Header title={"Post"} />
      {isDeleteModalOpen && (
        <DeleteModal
          onDelete={handleDeleteClick}
          onCancel={handleCancelClick}
        />
      )}
      <div
        style={{ marginTop: "60px", marginLeft: "100px", marginRight: "300px" }}
      >
        <div className={styles.studiesStatus} onClick={() => handleCommunityClick({ communityid })}>{communityName}</div>
        <div className={styles.studiesTitle}>{thisPost.title}</div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "14px",
            marginTop: "30px",
          }}
          onClick={() => handleProfileClick(userNickname)}
        >
          <img
            className={styles.postWriterProfile}
            src={userimg || noprofile}
            alt="noprofile"
          />
          <div className={styles.postWriterNickname}>{userNickname}</div>
          <div className={styles.postWriteDate}>
            {new Date(thisPost.createdat).toLocaleDateString()}
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
          {userData &&
            userData.length > 0 &&
            userData[0].userid === thisPost.userid ? (
            <>
              <div className={styles.revise} onClick={handleReviseClick}>
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
            <div className={styles.studiesDetailIndex}>준비기간</div>
            <div className={styles.studiesDetail}>
              {new Date(thisPost.startdate).toLocaleDateString()} ~{" "}
              {new Date(thisPost.enddate).toLocaleDateString()}
            </div>
          </div>
          <div className={styles.studiesDetails}>
            <div className={styles.studiesDetailIndex}>책</div>
            <div className={styles.studiesDetail}>{thisPost.book}</div>
          </div>
          <div className={styles.studiesDetails}>
            <div className={styles.studiesDetailIndex}>결과</div>
            <div className={styles.studiesDetail}>{thisPost.result}</div>
          </div>
        </div>
        <div style={{ marginTop: "70px" }}>
          <div className={styles.studiesIntro}>공부방법</div>
          <div style={{ padding: "30px 30px 30px 30px" }}>
            <div className={styles.studiesContent}>
              {formatDescription(thisPost.content)}
            </div>

            {thisPost.references &&
              thisPost.references.map((file, index) => (
                <div
                  key={index}
                  style={{
                    maxWidth: "350px",
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
              {commentData &&
                commentData.length > 0 &&
                commentData.map((comment, index) => (
                  <Comment
                    key={index}
                    userid={comment.userid}
                    content={comment.content}
                    commentData={comment}
                    onDelete={deleteComment}
                    userData={userData}
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
                src={
                  userData && userData.length > 0
                    ? userData[0].profileimage
                    : noprofile
                  // userData[0].profileimage || noprofile
                }
                alt="noprofile"
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  border: "2px solid #dddddd",
                  borderRadius: "12px",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  paddingBottom: "10px",
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
