import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./Post.module.css";
import supabase from "components/supabaseClient";

// icon & image
import more from "assets/icons/Communities/more.png";
import profile from "assets/icons/Communities/profile.png";
import commentOff from "assets/icons/Communities/comment_off.png";
import commentOn from "assets/icons/Communities/comment_on.png";
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
  post = {},
  community = [],
  user = [],
  allUser = [],
  comment = [],
  onBookmarkToggle,
}) => {
  const { communityId } = useParams();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
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

  const startdate = formatDate(post.startdate);
  const enddate = formatDate(post.enddate);

  const calculateDaysBetween = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end - start;
    const dayDiff = timeDiff / (1000 * 3600 * 24);
    return Math.ceil(dayDiff);
  };

  const days = calculateDaysBetween(startdate, enddate);

  const communityName =
    Array.isArray(community) && community.length > 0
      ? community.find((comm) => comm.communityid === post.communityid)?.name
      : "Unknown Communityy";

  const userimg =
    Array.isArray(allUser) && allUser.length > 0
      ? allUser.find((u) => u.userid === post.userid)?.profileimage
      : "Unknown User";

  const userNickname =
    Array.isArray(allUser) && allUser.length > 0
      ? allUser.find((u) => u.userid === post.userid)?.nickname
      : "Unknown User";

  const userName =
    Array.isArray(allUser) && allUser.length > 0
      ? allUser.find((u) => u.userid === post.userid)?.username
      : "Unknown User";

  const commentCount = Array.isArray(comment)
    ? comment.filter((c) => c.postid === post.postid).length
    : 0;

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

      const userId = session.user.id;

      const { data: likeData } = await supabase
        .from("PostLike")
        .select("*")
        .eq("postid", post.postid)
        .eq("userid", userId);

      setLiked(likeData.length > 0);

      const { data: bookmarkData } = await supabase
        .from("Bookmark")
        .select("*")
        .eq("postid", post.postid)
        .eq("userid", userId);
      setBookmarked(bookmarkData.length > 0);
    };

    checkLikeAndBookmark();
    fetchLikeCount();
  }, [post.postid]);

  const fetchLikeCount = async () => {
    const { count } = await supabase
      .from("PostLike")
      .select("*", { count: "exact" })
      .eq("postid", post.postid);

    setLikeCount(count);
  };

  const handlePostClick = async () => {
    await supabase
      .from("Post")
      .update({ viewnumber: post.viewnumber + 1 })
      .eq("postid", post.postid);

    navigate(`/detail-post/${post.postid}`, {
      state: {
        userData: user,
        allUserData: allUser,
        communityData: community,
        postData: post,
        // commentData: comment,
      },
    });
  };

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
    const userId = session.user.id;

    if (liked) {
      await supabase.from("PostLike").delete().eq("postid", post.postid);
      setLiked(false);
      setLikeCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
    } else {
      await supabase.from("PostLike").insert([
        {
          postid: post.postid,
          createdat: new Date(),
          userid: userId,
        },
      ]);
      setLiked(true);
      setLikeCount((prevCount) => prevCount + 1);
    }
  };

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

    const userId = session.user.id;

    if (bookmarked) {
      await supabase.from("Bookmark").delete().eq("postid", post.postid);
      setBookmarked(false);
      onBookmarkToggle(post.postid);
    } else {
      await supabase.from("Bookmark").insert([
        {
          postid: post.postid,
          createdat: new Date(),
          userid: userId,
          communityid: post.communityid,
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
      .eq("postid", post.postid);

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
        {user[0]?.userid === post.userid && (
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
              {new Date(post.createdat).toLocaleDateString()}
            </span>
          </div>
          <div className={styles.postContent}>
            <p className={styles.postTitle}>[{post.title}]</p>
            <p className={styles.postPeriod}>
              1. 준비기간 : {new Date(post.startdate).toLocaleDateString()} ~{" "}
              {new Date(post.enddate).toLocaleDateString()} ({days}일)
            </p>
            <p className={styles.postResult}>2. 결과 : {post.result}</p>
          </div>
          <div className={styles.postETC}>
            <div className={styles.postComment}>
              <img
                className={styles.commentIcon}
                src={commentOff}
                alt="commentOff"
              />
              <span className={styles.commentNumber}>{post.commentCount}</span>
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
              <span className={styles.viewNumber}>{post.viewnumber}</span>
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
