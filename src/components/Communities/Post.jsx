import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Post.module.css";
import supabase from "components/supabaseClient";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import DeleteModal from "components/Post/DeleteModal";
import { useDataContext } from "api/DataContext";

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
import loadinggif from "assets/images/loading.gif";

const fetchPostData = async (postId) => {
  const { data, error } = await supabase
    .from("Post")
    .select("*")
    .eq("postid", postId);

  if (error) throw new Error(error.message);
  return data;
};

const fetchPostLikeData = async (postId) => {
  const { data, error } = await supabase
    .from("PostLike")
    .select("*", { count: "exact" })
    .eq("postid", postId);

  if (error) throw new Error(error.message);
  return data;
};

const fetchPostCommentData = async (postId) => {
  const { data, error } = await supabase
    .from("Comment")
    .select("*", { count: "exact" })
    .eq("postid", postId);

  if (error) throw new Error(error.message);
  return data;
};

const fetchPostBookmarkData = async (postId) => {
  const { data, error } = await supabase
    .from("Bookmark")
    .select("*")
    .eq("postid", postId);

  if (error) throw new Error(error.message);
  return data;
};

const fetchPostViewData = async (postId) => {
  const { data, error } = await supabase
    .from("Post")
    .select("*")
    .eq("postid", postId);

  if (error) throw new Error(error.message);
  return data;
};

const fetchAllUserData = async (userId) => {
  const { data, error } = await supabase
    .from("User")
    .select("*")
    .eq("userid", userId);

  if (error) throw new Error(error.message);
  return data;
}

const Post = ({ postId }) => {
  const { userData, communityData, isLoading } = useDataContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: Post = [], isLoading: isPostLoading } = useQuery({
    queryKey: ["Post", postId],
    queryFn: () => fetchPostData(postId),
    onError: (error) => console.log(error.message),
  });

  const { data: postLike = [], isLoading: isLikeLoading } = useQuery({
    queryKey: ["postLike", postId],
    queryFn: () => fetchPostLikeData(postId),
    staleTime: 0,
    refetchOnWindowFocus: true,
    onError: (error) => console.log(error.message),
  });

  const { data: postComment = [], isLoading: isCommentLoading } = useQuery({
    queryKey: ["postComment", postId],
    queryFn: () => fetchPostCommentData(postId),
    onError: (error) => console.log(error.message),
  });

  const { data: postBookmark = [], isLoading: isBookmarkLoading } = useQuery({
    queryKey: ["postBookmark", postId],
    queryFn: () => fetchPostBookmarkData(postId),
    onError: (error) => console.log(error.message),
  });

  const { data: postView = [], isLoading: isViewLoading } = useQuery({
    queryKey: ["postView", postId],
    queryFn: () => fetchPostViewData(postId),
    onError: (error) => console.log(error.message),
  });

  const { data: allUser = {}, isLoading: isAllUser } = useQuery({
    queryKey: ["allUser", postId, userData],
    queryFn: () => fetchAllUserData(Post[0].userid),
    select: (data) => (Array.isArray(data) && data.length > 0 ? data[0] : {}),
    onError: (error) => console.log(error.message),
  });

  useEffect(() => {
    const checkLikeAndBookmark = async () => {
      const userLike = postLike.find(
        (like) => like.userid === userData?.userid && like.postid === postId
      );
      setLiked(!!userLike);

      const userBookmark = postBookmark.find(
        (bookmark) =>
          bookmark.userid === userData?.userid && bookmark.postid === postId
      );
      setBookmarked(!!userBookmark);
    };
    if (userData) {
      checkLikeAndBookmark();
    }
  }, [postId, userData, postLike, postBookmark]);

  const likeMutation = useMutation({
    mutationFn: async ({ newLike, liked }) => {
      const { data, error } = liked
        ? await supabase
          .from("PostLike")
          .delete()
          .eq("postid", postId)
          .eq("userid", newLike.userid)
        : await supabase.from("PostLike").insert([newLike]);

      if (error) {
        console.error("Error on mutation:", error.message);
        throw new Error(error.message);
      }

      return data;
    },
    onMutate: async ({ newLike, liked }) => {
      await queryClient.cancelQueries(["postLike", postId]);

      const previousLike = queryClient.getQueryData(["postLike", postId]);

      if (liked) {
        queryClient.setQueryData(["postLike", postId], (old) => {
          if (!old) return [];
          return old.filter((like) => like.userid !== newLike.userid);
        });
      } else {
        queryClient.setQueryData(["postLike", postId], (old) => {
          if (!old)
            return [{ ...newLike, createdat: new Date().toISOString() }];
          return [...old, { ...newLike, createdat: new Date().toISOString() }];
        });
      }

      return { previousLike };
    },
    onError: (err, { newLike }, context) => {
      queryClient.setQueryData(["postLike", postId], context.previousLike);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(["postLike", postId]);
    },
  });

  const bookmarkMutation = useMutation({
    mutationFn: async ({ newBookmark, bookmarked }) => {
      const { data, error } = bookmarked
        ? await supabase
          .from("Bookmark")
          .delete()
          .eq("postid", postId)
          .eq("userid", newBookmark.userid)
        : await supabase.from("Bookmark").insert([newBookmark]);

      if (error) {
        console.error("Error on mutation:", error.message);
        throw new Error(error.message);
      }
      console.log("bookmark", data);
      return data;
    },
    onMutate: async ({ newBookmark, bookmarked }) => {
      await queryClient.cancelQueries(["postBookmark", postId]);

      const previousBookmark = queryClient.getQueryData([
        "postBookmark",
        postId,
      ]);

      if (bookmarked) {
        queryClient.setQueryData(["postBookmark", postId], (old) => {
          console.log("true bookmark");
          if (!old) return [];
          return old.filter(
            (bookmark) => bookmark.userid !== newBookmark.userid
          );
        });
      } else {
        queryClient.setQueryData(["postBookmark", postId], (old) => {
          console.log("false bookmark");
          if (!old)
            return [{ ...newBookmark, createdat: new Date().toISOString() }];
          return [
            ...old,
            { ...newBookmark, createdat: new Date().toISOString() },
          ];
        });
      }

      return { previousBookmark };
    },
    onError: (err, { newBookmark }, context) => {
      queryClient.setQueryData(["postBookmark", postId], context.previousLike);
    },
    onSettled: async () => {
      const updatedData = await queryClient.fetchQuery({
        queryKey: ["postBookmark", postId],
        queryFn: () => fetchPostLikeData(postId),
      });

      console.log("updatedData", updatedData.length);
      queryClient.setQueryData(["postBookmark", postId], updatedData);
    },
  });

  const viewMutation = useMutation({
    mutationFn: async (postId) => {
      const { data, error } = await supabase
        .from("Post")
        .update({ viewnumber: postView[0].viewnumber + 1 })
        .eq("postid", postId);

      if (error) {
        console.error("Error on mutation:", error.message);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      navigate(`/detail-post/${postId}`);
      queryClient.invalidateQueries(["postView", postId]);
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  const loading =
    isLoading ||
    isPostLoading ||
    isLikeLoading ||
    isCommentLoading ||
    isBookmarkLoading ||
    isViewLoading ||
    isAllUser;

  if (loading) {
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
        <img src={loadinggif} style={{ width: "80px" }} alt="Loading..." />
      </div>
    );
  }

  function formatDate(date) {
    try {
      const validDate = new Date(date);
      return validDate.toISOString();
    } catch (error) {
      console.error("formatDate에 전달된 잘못된 날짜:", date);
      return "잘못된 날짜";
    }
  }

  const startdate = formatDate(Post[0].startdate);
  const enddate = formatDate(Post[0].enddate);

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
      ? communityData.find((comm) => comm.communityid === Post[0].communityid)
        ?.name
      : "Unknown Communityy";

  const handlePostClick = () => {
    if (!isViewLoading) {
      viewMutation.mutate(postId);
    }
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

    if (!session) {
      alert("로그인이 필요합니다. 로그인 후 다시 시도해 주세요.");
      return;
    }

    const userId = session.user.id;

    const newLike = {
      postid: postId,
      createdat: new Date(),
      userid: userId,
    };

    likeMutation.mutate({ newLike, liked });
    setLiked((prevLiked) => !prevLiked);
    queryClient.refetchQueries(["postLike", postId]);
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

    if (!session) {
      alert("로그인이 필요합니다. 로그인 후 다시 시도해 주세요.");
      return;
    }

    const userId = session.user.id;

    const newBookmark = {
      userid: userId,
      communityid: Post[0].communityid,
      postid: postId,
      createdat: new Date(),
    };

    bookmarkMutation.mutate({ newBookmark, bookmarked });
    setBookmarked((prevBookmarked) => !prevBookmarked);
    queryClient.refetchQueries(["postBookmark", postId]);
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

  const handleRemoveClick = (event) => {
    event.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const handleDeleteClick = async (event) => {
    event.stopPropagation();
    const { data, error } = await supabase
      .from("Post")
      .delete()
      .eq("postid", postId);

    if (error) {
      console.error("게시글 삭제 실패:", error);
    } else {
      console.log("게시글 삭제 성공:", data);
    }

    queryClient.invalidateQueries(["Post", postId]);
    setShowOptions(false);
    setIsDeleteModalOpen(false);
  };

  const handleCancelClick = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <div className={styles.post} onClick={handlePostClick}>
      {isDeleteModalOpen && (
        <DeleteModal
          title={"Post"}
          onDelete={handleDeleteClick}
          onCancel={handleCancelClick}
        />
      )}
      <div
        style={{
          marginTop: "20px",
          marginBottom: "20px",
          marginRight: "20px",
        }}
      >
        <span className={styles.communityName}>{communityName}</span>
        {userData.userid === Post[0].userid && (
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
          {allUser?.profileimage ? (
            <img className={styles.userProfile} src={allUser?.profileimage} alt="profile" />
          ) : (
            <img className={styles.userProfile} src={noprofile} alt="profile" />
          )}
        </div>

        <div className={styles.postWriterContent}>
          <div className={styles.postWriter}>
            <span className={styles.postWriterNickName}>{allUser?.nickname}</span>
            <span className={styles.postWriterID}>@{allUser?.username}</span>
            <span className={styles.postWriteDate}>
              {new Date(Post[0].createdat).toLocaleDateString()}
            </span>
          </div>
          <div className={styles.postContent}>
            <p className={styles.postTitle}>[{Post[0].title}]</p>
            <p className={styles.postPeriod}>
              1. 준비기간 : {new Date(Post[0].startdate).toLocaleDateString()} ~{" "}
              {new Date(Post[0].enddate).toLocaleDateString()} ({days}일)
            </p>
            <p className={styles.postResult}>2. 결과 : {Post[0].result}</p>
          </div>
          <div className={styles.postETC}>
            <div className={styles.postComment}>
              <img
                className={styles.commentIcon}
                src={commentOff}
                alt="commentOff"
              />
              <span className={styles.commentNumber}>{postComment.length}</span>
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
                {postLike.length}
              </span>
            </div>
            <div>
              <img className={styles.viewIcon} src={view} alt="view" />
              <span className={styles.viewNumber}>{Post[0].viewnumber}</span>
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
            <div className={styles.moreClickDelete} onClick={handleRemoveClick}>
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
