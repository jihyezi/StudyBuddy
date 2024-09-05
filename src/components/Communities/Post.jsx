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

const Post = ({ post = {}, community = [], user = [], comment = [] }) => {
  const { communityId } = useParams();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

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

  const communityName = Array.isArray(community)
    ? community.find((comm) => comm.communityid === post.communityid)?.name
    : "Unknown Community";

  const userimg = Array.isArray(user)
    ? user.find((u) => u.userid === post.userid)?.profileimage
    : "Unknown User";

  const userNickname = Array.isArray(user)
    ? user.find((u) => u.userid === post.userid)?.nickname
    : "Unknown User";

  const userName = Array.isArray(user)
    ? user.find((u) => u.userid === post.userid)?.username
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
  }, []);

  useEffect(() => {
    fetchLikeCount();
  }, [post.postid]);

  const fetchLikeCount = async () => {
    const { count } = await supabase
      .from("PostLike")
      .select("*", { count: "exact" })
      .eq("postid", post.postid);

    setLikeCount(count);
  };

  const handlePostClick = () => {
    navigate(`/detail-post/${post.postid}`, {
      state: {
        userData: user,
        communityData: community,
        postData: post,
        // commentData: comment,
      },
    });
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
      await supabase.from("PostLike").delete().eq("postid", post.postid);
      setLiked(false);
    } else {
      await supabase.from("PostLike").insert([
        {
          postid: post.postid,
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
      await supabase.from("Bookmark").delete().eq("postid", post.postid);
      setBookmarked(false);
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

  if (!community || !user) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className={styles.post} onClick={handlePostClick}>
      <div
        style={{ marginTop: "20px", marginBottom: "20px", marginRight: "20px" }}
      >
        <span className={styles.communityName}>{communityName}</span>
        {user.userid === post.userid && (
          <img className={styles.moreIcon} src={more} alt="more" />
        )}
      </div>

      <div className={styles.postDetail}>
        <div>
          <img className={styles.userProfile} src={userimg} alt="profile" />
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
              <span className={styles.likeNumber}>{likeCount}</span>
            </div>
            <div>
              <img className={styles.viewIcon} src={view} alt="view" />
              <span className={styles.viewNumber}>{post.viewNumber}</span>
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
      </div>
    </div>
  );
};

export default Post;
