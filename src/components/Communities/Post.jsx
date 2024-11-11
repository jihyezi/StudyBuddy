import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import styles from "./Post.module.css";
import supabase from "components/supabaseClient";

// icon & image
import more from "assets/icons/Communities/more.png";
import commentOff from "assets/icons/Communities/comment_off.png";
import likeOff from "assets/icons/Communities/like_off.png";
import likeOn from "assets/icons/Communities/like_on.png";
import view from "assets/icons/Communities/view.png";
import bookmarkOff from "assets/icons/Communities/bookmark_off.png";
import bookmarkOn from "assets/icons/Communities/bookmark_on.png";
import share from "assets/icons/Communities/share.png";
import editIcon from "assets/icons/Post/edit.png";
import deleteIcon from "assets/icons/Post/delete.png";
import noprofile from "assets/images/Profile/noprofile.png";

const Post = ({
  thisPost = {},
  postData = {},
  communityData = [],
  userData = [],
  allUserData = [],
  onBookmarkToggle,
}) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [showOptions, setShowOptions] = useState(false);

  function formatDate(date) {
    try {
      const validDate = new Date(date);
      return validDate.toISOString();
    } catch (error) {
      console.error("formatDate에 전달된 잘못된 날짜:", date);
      return "잘못된 날짜";
    }
  }

  const startdate = formatDate(thisPost.startdate);
  const enddate = formatDate(thisPost.enddate);

  const calculateDaysBetween = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end - start;
    const dayDiff = timeDiff / (1000 * 3600 * 24);
    return Math.ceil(dayDiff);
  };

  const days = calculateDaysBetween(startdate, enddate);

  const communityName =
    Array.isArray(communityData) && communityData.length > 0
      ? communityData.find((comm) => comm.communityid === thisPost.communityid)?.name
      : "Unknown Communityy";

  const userimg =
    Array.isArray(allUserData) && allUserData.length > 0
      ? allUserData.find((u) => u.userid === thisPost.userid)?.profileimage
      : "Unknown User";

  const userNickname =
    Array.isArray(allUserData) && allUserData.length > 0
      ? allUserData.find((u) => u.userid === thisPost.userid)?.nickname
      : "Unknown User";

  const userName =
    Array.isArray(allUserData) && allUserData.length > 0
      ? allUserData.find((u) => u.userid === thisPost.userid)?.username
      : "Unknown User";

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

      const { data: likeData } = await supabase
        .from("PostLike")
        .select("*")
        .eq("postid", thisPost.postid)
        .eq("userid", userId);

      setLiked(likeData.length > 0);
      fetchLikeCount();

      const { data: bookmarkData } = await supabase
        .from("Bookmark")
        .select("*")
        .eq("postid", thisPost.postid)
        .eq("userid", userId);
      setBookmarked(bookmarkData.length > 0);
    };

    checkLikeAndBookmark();
    fetchLikeCount();
    fetchCommentCount();
  }, [thisPost.postid]);



  const handlePostClick = async () => {
    await supabase
      .from("Post")
      .update({ viewnumber: thisPost.viewnumber + 1 })
      .eq("postid", thisPost.postid);

    navigate(`/detail-post/${thisPost.postid}`, {
      state: {
        userData: userData || null,
        allUserData: allUserData,
        communityData: communityData,
        postData: postData,
        thisPost: thisPost
      },
    });
  };

  console.log("post-post", thisPost)

  const toggleLike = async (event) => {
    event.stopPropagation();

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
      setLikeCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
    } else {
      await supabase.from("PostLike").insert([
        {
          postid: thisPost.postid,
          createdat: new Date(),
          userid: userId,
        },
      ]);
      setLiked(true);
      setLikeCount((prevCount) => prevCount + 1);
    }
  };

  const fetchLikeCount = async () => {
    const { count } = await supabase
      .from("PostLike")
      .select("*", { count: "exact" })
      .eq("postid", thisPost.postid);

    setLikeCount(count);
  };

  const fetchCommentCount = async () => {
    const { count } = await supabase
      .from("Comment")
      .select("*", { count: "exact" })
      .eq("postid", thisPost.postid)

    setCommentCount(count);
  }

  const toggleBookmark = async (event) => {
    event.stopPropagation();

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
      onBookmarkToggle(thisPost.postid);
    } else {
      await supabase.from("Bookmark").insert([
        {
          postid: thisPost.postid,
          createdat: new Date(),
          userid: userId,
          communityid: thisPost.communityid,
        },
      ]);
      setBookmarked(true);
    }
  };

  const handleShare = (event) => {
    event.stopPropagation();

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

  const moreClick = (event) => {
    event.stopPropagation();
    setShowOptions(!showOptions);
  };

  const handleEditClick = (event) => {
    event.stopPropagation();
    setShowOptions(false);
  };

  const handleDeleteClick = async (event) => {
    event.stopPropagation();
    const { data, error } = await supabase
      .from("Post")
      .delete()
      .eq("postid", thisPost.postid);

    if (error) {
      console.error("게시글 삭제 실패:", error);
    } else {
      console.log("게시글 삭제 성공:", data);
    }

    setShowOptions(false);
  };

  return (
    <div className={styles.post} onClick={handlePostClick}>
      <div
        style={{ marginTop: "20px", marginBottom: "20px", marginRight: "20px" }}
      >
        <span className={styles.communityName}>{communityName}</span>
        {userData[0]?.userid === thisPost.userid && (
          <img
            className={styles.moreIcon}
            src={more}
            alt="more"
            onClick={moreClick}
          />
        )}
      </div>

      <div className={styles.postDetail}>
        <div>
          {userimg ?
            <img className={styles.userProfile} src={userimg} alt="profile" />
            : <img className={styles.userProfile} src={noprofile} alt="profile" />
          }

        </div>

        <div className={styles.postWriterContent}>
          <div className={styles.postWriter}>
            <span className={styles.postWriterNickName}>{userNickname}</span>
            <span className={styles.postWriterID}>@{userName}</span>
            <span className={styles.postWriteDate}>
              {new Date(thisPost.createdat).toLocaleDateString()}
            </span>
          </div>
          <div className={styles.postContent}>
            <p className={styles.postTitle}>[{thisPost.title}]</p>
            <p className={styles.postPeriod}>
              1. 준비기간 : {new Date(thisPost.startdate).toLocaleDateString()} ~{" "}
              {new Date(thisPost.enddate).toLocaleDateString()} ({days}일)
            </p>
            <p className={styles.postResult}>2. 결과 : {thisPost.result}</p>
          </div>
          <div className={styles.postETC}>
            <div className={styles.postComment}>
              <img
                className={styles.commentIcon}
                src={commentOff}
                alt="commentOff"
              />
              <span className={styles.commentNumber}>{commentCount}</span>
            </div>
            <div className={styles.postLike}>
              <img
                className={styles.likeIcon}
                src={liked ? likeOn : likeOff}
                alt="likeOn"
                onClick={toggleLike}
              />
              <span
                className={styles.likeNumber}
                style={{ color: liked ? "#ff7474" : "#9c9c9c" }}
              >
                {likeCount}
              </span>
            </div>
            <div>
              <img className={styles.viewIcon} src={view} alt="view" />
              <span className={styles.viewNumber}>{thisPost.viewnumber}</span>
            </div>
            <div>
              <img
                className={styles.bookmarkIcon}
                src={bookmarked ? bookmarkOn : bookmarkOff}
                alt="bookmark"
                onClick={toggleBookmark}
              />
            </div>
            <div>
              <img
                className={styles.shareIcon}
                src={share}
                alt="share"
                onClick={handleShare}
              />
            </div>
          </div>
        </div>
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
            <div className={styles.moreClickDelete} onClick={handleDeleteClick}>
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
    </div>
  );
};

export default Post;