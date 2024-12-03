import React, { useEffect, useState } from "react";
import styles from "./PopularPost.module.css";
import "fonts/Font.css";
import supabase from "components/supabaseClient";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useDataContext } from "api/DataContext";

//icons
import likeOn from "assets/icons/Communities/like_on.png";
import likeOff from "assets/icons/Home/like_off.png";
import commentOff from "assets/icons/Home/comment_off.png";
import bookmarkOn from "assets/icons/Communities/bookmark_on.png";
import bookmarkOff from "assets/icons/Home/bookmark_off.png";

// data
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

const PopularPost = React.memo(
  ({
    small,
    postData,
    postLike = [],
    comment = [],
    communityName,
    onClick,
  }) => {
    const { userData } = useDataContext();
    const queryClient = useQueryClient();
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);

    const { data: postLikeData = [], isLoading: isLikeLoading } = useQuery({
      queryKey: ["postLikeData", postData.postid],
      queryFn: () => fetchPostLikeData(postData.postid),
      staleTime: 0,
      refetchOnWindowFocus: true,
      onError: (error) => console.log(error.message),
    });

    const { data: postComment = [], isLoading: isCommentLoading } = useQuery({
      queryKey: ["postComment", postData.postid],
      queryFn: () => fetchPostCommentData(postData.postid),
      onError: (error) => console.log(error.message),
    });

    const { data: postBookmark = [], isLoading: isBookmarkLoading } = useQuery({
      queryKey: ["postBookmark", postData.postid],
      queryFn: () => fetchPostBookmarkData(postData.postid),
      onError: (error) => console.log(error.message),
    });

    useEffect(() => {
      const checkLikeAndBookmark = async () => {
        const userLike = postLikeData.find(
          (like) =>
            like.userid === userData?.userid && like.postid === postData.postid
        );
        setLiked(!!userLike);

        const userBookmark = postBookmark.find(
          (bookmark) =>
            bookmark.userid === userData?.userid &&
            bookmark.postid === postData.postid
        );
        setBookmarked(!!userBookmark);
      };
      if (userData) {
        checkLikeAndBookmark();
      }
    }, [postData.postid, userData, postLikeData, postBookmark]);

    const likeMutation = useMutation({
      mutationFn: async ({ newLike, liked }) => {
        const { data, error } = liked
          ? await supabase
              .from("PostLike")
              .delete()
              .eq("postid", postData.postid)
              .eq("userid", newLike.userid)
          : await supabase.from("PostLike").insert([newLike]);

        if (error) {
          console.error("Error on mutation:", error.message);
          throw new Error(error.message);
        }

        return data;
      },
      onMutate: async ({ newLike, liked }) => {
        await queryClient.cancelQueries(["postLikeData", postData.postid]);

        const previousLike = queryClient.getQueryData([
          "postLikeData",
          postData.postid,
        ]);

        if (liked) {
          queryClient.setQueryData(["postLikeData", postData.postid], (old) => {
            if (!old) return [];
            return old.filter((like) => like.userid !== newLike.userid);
          });
        } else {
          queryClient.setQueryData(["postLikeData", postData.postid], (old) => {
            if (!old)
              return [{ ...newLike, createdat: new Date().toISOString() }];
            return [
              ...old,
              { ...newLike, createdat: new Date().toISOString() },
            ];
          });
        }

        return { previousLike };
      },
      onError: (err, { newLike }, context) => {
        queryClient.setQueryData(
          ["postLikeData", postData.postid],
          context.previousLike
        );
      },
      onSettled: async () => {
        await queryClient.invalidateQueries(["postLikeData", postData.postid]);
      },
    });

    const bookmarkMutation = useMutation({
      mutationFn: async ({ newBookmark, bookmarked }) => {
        const { data, error } = bookmarked
          ? await supabase
              .from("Bookmark")
              .delete()
              .eq("postid", postData.postid)
              .eq("userid", newBookmark.userid)
          : await supabase.from("Bookmark").insert([newBookmark]);

        if (error) {
          console.error("Error on mutation:", error.message);
          throw new Error(error.message);
        }
        return data;
      },
      onMutate: async ({ newBookmark, bookmarked }) => {
        await queryClient.cancelQueries(["postBookmark", postData.postid]);

        const previousBookmark = queryClient.getQueryData([
          "postBookmark",
          postData.postid,
        ]);

        if (bookmarked) {
          queryClient.setQueryData(["postBookmark", postData.postid], (old) => {
            if (!old) return [];
            return old.filter(
              (bookmark) => bookmark.userid !== newBookmark.userid
            );
          });
        } else {
          queryClient.setQueryData(["postBookmark", postData.postid], (old) => {
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
        queryClient.setQueryData(
          ["postBookmark", postData.postid],
          context.previousBookmark
        );
      },
      onSettled: async () => {
        await queryClient.invalidateQueries(["postBookmark", postData.postid]);
      },
    });

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
        postid: postData.postid,
        createdat: new Date(),
        userid: userId,
      };

      likeMutation.mutate({ newLike, liked });
      setLiked((prevLiked) => !prevLiked);
      queryClient.refetchQueries(["postLikeData", postData.postid]);
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
        communityid: postData.communityid,
        postid: postData.postid,
        createdat: new Date(),
      };

      bookmarkMutation.mutate({ newBookmark, bookmarked });
      setBookmarked((prevBookmarked) => !prevBookmarked);
      queryClient.refetchQueries(["postBookmark", postData.postid]);
    };

    return (
      <div
        className={`${styles.community} ${small ? styles.smallCommunity : ""}`}
        onClick={onClick}
      >
        <p
          className={`${styles.communityName} ${
            small ? styles.smallcommunityName : ""
          }`}
        >
          {communityName ? communityName : "0"}
        </p>
        <p
          className={`${styles.postTitle} ${
            small ? styles.smallpostTitle : ""
          }`}
        >
          {postData?.title}
        </p>
        <div
          className={`${styles.postETC} ${small ? styles.smallpostETC : ""}`}
        >
          <div className={styles.like}>
            <img
              className={styles.likeIcon}
              src={liked ? likeOn : likeOff}
              alt="likeOff"
              onClick={toggleLike}
            />
            <span
              className={styles.likeNumber}
              style={{ color: liked ? "#ff7474" : "#9c9c9c" }}
            >
              {postLikeData.length}
            </span>
          </div>
          <div className={styles.comment}>
            <img
              className={styles.commentIcon}
              src={commentOff}
              alt="commentOff"
            />
            <span className={styles.commentNumber}>
              {comment ? comment : "0"}
            </span>
          </div>
          <div className={styles.bookmark}>
            <img
              className={styles.bookmarkIcon}
              src={bookmarked ? bookmarkOn : bookmarkOff}
              alt="bookmarkOff"
              onClick={toggleBookmark}
            />
          </div>
        </div>
      </div>
    );
  }
);
export default PopularPost;
