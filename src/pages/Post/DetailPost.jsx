import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styles from "./DetailPost.module.css";
import supabase from "components/supabaseClient";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useDataContext } from "api/DataContext";

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

const fetchPostBookmarkData = async (postId) => {
  const { data, error } = await supabase
    .from("Bookmark")
    .select("*")
    .eq("postid", postId);

  if (error) throw new Error(error.message);
  return data;
};

const fetchPostCommentData = async (postId) => {
  const { data, error } = await supabase
    .from("Comment")
    .select("*")
    .eq("postid", postId);

  if (error) throw new Error(error.message);
  return data;
};

const DetailPost = ({ }) => {
  const { postId } = useParams();
  const { userData, allUserData, communityData, postData, isLoading } =
    useDataContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const userId = userData.userid;
  const [inputValue, setInputValue] = useState("");
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: Post = [], isLoading: isPostLoading } = useQuery({
    queryKey: ["Post", postId],
    queryFn: () => fetchPostData(postId),
    onError: (error) => console.log(error.message),
  });

  const { data: postLike = [], isLoading: isPostLikeLoading } = useQuery({
    queryKey: ["postLike", postId],
    queryFn: () => fetchPostLikeData(postId),
    onError: (error) => console.log(error.message),
  });

  const { data: postBookmark = [], isLoading: isPostBookmarkLoading } =
    useQuery({
      queryKey: ["postBookmark", postId],
      queryFn: () => fetchPostBookmarkData(postId),
      onError: (error) => console.log(error.message),
    });

  const { data: postComments = [], isLoading: isPostCommentLoading } = useQuery(
    {
      queryKey: ["postComments", postId],
      queryFn: () => fetchPostCommentData(postId),
      onError: (error) => console.log(error.message),
    }
  );

  useEffect(() => {
    setInputValue("");
    const checkLikeAndBookmark = async () => {
      const userLike = postLike.find((like) => like.userid === userData.userid);
      setLiked(!!userLike);

      const userBookmark = postBookmark.find(
        (bookmark) => bookmark.userid === userData.userid
      );
      setBookmarked(!!userBookmark);
    };

    if (userData) {
      checkLikeAndBookmark();
    }
  }, [postLike, postBookmark, userData]);

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
      const updatedData = await queryClient.fetchQuery({
        queryKey: ["postLike", postId],
        queryFn: () => fetchPostLikeData(postId),
      });

      console.log("updatedData", updatedData.length);
      queryClient.setQueryData(["postLike", postId], updatedData);
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
          if (!old) return [];
          return old.filter(
            (bookmark) => bookmark.userid !== newBookmark.userid
          );
        });
      } else {
        queryClient.setQueryData(["postBookmark", postId], (old) => {
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

  const commentMutation = useMutation({
    mutationFn: async (newComment) => {
      const { data, error } = await supabase
        .from("Comment")
        .insert([newComment]);
      if (error) throw new Error(error.message);

      return data;
    },
    onMutate: async (newComment) => {
      await queryClient.cancelQueries(["postComments", postId]);

      const previousComments = queryClient.getQueryData([
        "postComments",
        postId,
      ]);

      queryClient.setQueryData(["postComments", postId], (old) => [
        ...old,
        { ...newComment, createdat: new Date().toISOString() },
      ]);

      return { previousComments };
    },
    onError: (err, newComment, context) => {
      queryClient.setQueryData(
        ["postComments", postId],
        context.previousComments
      );
    },
    onSettled: () => {
      setInputValue("");
      queryClient.invalidateQueries(["postComments", postId]);
    },
  });

  if (
    isLoading ||
    isPostLoading ||
    isPostLikeLoading ||
    isPostBookmarkLoading ||
    isPostCommentLoading
  ) {
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

  const communityName = Array.isArray(communityData)
    ? communityData.find((comm) => comm.communityid === Post[0].communityid)
      ?.name
    : "Unknown Community";

  const communityid = Array.isArray(communityData)
    ? communityData.find((comm) => comm.communityid === Post[0].communityid)
      ?.communityid
    : "Unknown Community";

  const username =
    Array.isArray(allUserData) && allUserData.length > 0
      ? allUserData.find((u) => u.userid === Post[0].userid)?.username
      : "Unknown User";

  const selectedUserData =
    Array.isArray(allUserData) && allUserData.length > 0
      ? allUserData.find((u) => u.userid === Post[0].userid) // postData.userid에 해당하는 사용자 데이터 찾기
      : null;

  const userimg =
    Array.isArray(allUserData) && allUserData.length > 0
      ? allUserData.find((u) => u.userid === Post[0].userid)?.profileimage
      : "Unknown User";

  const userNickname =
    Array.isArray(allUserData) && allUserData.length > 0
      ? allUserData.find((u) => u.userid === Post[0].userid)?.nickname
      : "Unknown User";

  const handleReviseClick = () => {
    // navigate(`/revise-post/${postId}`);
    alert("수정기능을 구현중입니다");
    return;
  };

  const handleRemoveClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteClick = async () => {
    const { data, error } = await supabase
      .from("Post")
      .delete()
      .eq("postid", postId);

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

  const toggleShare = () => {
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

  const handleCommunityClick = (item) => {
    navigate(`/detail-community/${item.communityid}`);
  };

  const handleProfileClick = (item) => {
    navigate(`/profile/${item}`);
  };

  //댓글 등록
  const registerClick = async (event) => {
    if (!userData) {
      alert("로그인이 필요합니다. 로그인 후 다시 시도해 주세요.");
      return;
    }

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

    if (!inputValue.trim()) return;

    const userId = session.user.id;
    const newComment = {
      postid: postId,
      userid: userId,
      content: inputValue,
      createdat: new Date(),
      updatedat: new Date(),
    };

    commentMutation.mutate(newComment);
  };

  const handleCommentDelete = (commentId) => {
    const updatedComments = postComments.filter(
      (comment) => comment.commentid !== commentId
    );
    queryClient.setQueryData(["postComments", postId], updatedComments);
  };

  return (
    <div style={{ width: "100%", maxWidth: "1200px", margin: "0" }}>
      <Header title={"Post"} />
      {isDeleteModalOpen && (
        <DeleteModal
          title={"Post"}
          onDelete={handleDeleteClick}
          onCancel={handleCancelClick}
        />
      )}
      <div
        style={{ marginTop: "60px", marginLeft: "100px", marginRight: "300px" }}
      >
        <div
          className={styles.studiesStatus}
          onClick={() => handleCommunityClick({ communityid })}
        >
          {communityName}
        </div>
        <div className={styles.studiesTitle}>{Post[0].title}</div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "14px",
            marginTop: "30px",
          }}
          onClick={() => handleProfileClick(username)}
        >
          <img
            className={styles.postWriterProfile}
            src={userimg || noprofile}
            alt="noprofile"
          />
          <div className={styles.postWriterNickname}>{userNickname}</div>
          <div className={styles.postWriteDate}>
            {new Date(Post[0].createdat).toLocaleDateString()}
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
            width: "800px",
          }}
        >
          {userData && userData.userid === Post[0].userid && (
            <>
              <div className={styles.revise} onClick={handleReviseClick}>
                수정
              </div>
              <div className={styles.delete} onClick={handleRemoveClick}>
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
              {new Date(Post[0].startdate).toLocaleDateString()} ~{" "}
              {new Date(Post[0].enddate).toLocaleDateString()}
            </div>
          </div>
          <div className={styles.studiesDetails}>
            <div className={styles.studiesDetailIndex}>책</div>
            <div className={styles.studiesDetail}>{Post[0].book}</div>
          </div>
          <div className={styles.studiesDetails}>
            <div className={styles.studiesDetailIndex}>결과</div>
            <div className={styles.studiesDetail}>{Post[0].result}</div>
          </div>
        </div>
        <div style={{ marginTop: "70px" }}>
          <div className={styles.studiesIntro}>공부방법</div>
          <div style={{ padding: "30px 30px 30px 30px" }}>
            <div className={styles.studiesContent}>
              {formatDescription(Post[0].content)}
            </div>

            {Post[0].references &&
              Post[0].references.map((file, index) => (
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
              댓글 {postComments.length}개
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
                onClick={toggleShare}
              />
            </div>
          </div>

          <div style={{ padding: "30px 30px 30px 30px" }}>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "40px" }}
            >
              {postComments.map((comment, index) => (
                <Comment
                  key={index}
                  comment={comment}
                  userData={userData}
                  allUserData={allUserData}
                  onDelete={handleCommentDelete}
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
                  userData && userData.profileimage
                    ? userData.profileimage
                    : noprofile
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
