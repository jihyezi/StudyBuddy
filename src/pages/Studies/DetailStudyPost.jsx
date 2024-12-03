import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styles from "./DetailStudyPost.module.css";
import supabase from "components/supabaseClient";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useDataContext } from "api/DataContext";

// component
import Header from "components/Post/DetailHeader";
import StudyComment from "components/Post/StudyComment";
import DeleteModal from "components/Post/DeleteModal";

// icon & image
import more from "assets/icons/Communities/more.png";
import likeOff from "assets/icons/Communities/like_off.png";
import likeOn from "assets/icons/Communities/like_on.png";
import share from "assets/icons/Communities/share.png";
import loadinggif from "assets/images/loading.gif";
import noprofile from "assets/images/Profile/noprofile.png";

const fetchStudyData = async (studyId) => {
  const { data, error } = await supabase
    .from("Study")
    .select("*")
    .eq("studyid", studyId);

  if (error) throw new Error(error.message);
  return data;
};

const fetchStudyLikeData = async (studyId) => {
  const { data, error } = await supabase
    .from("StudyLike")
    .select("*")
    .eq("studyid", studyId);

  if (error) throw new Error(error.message);
  return data;
};

const fetchStudyCommentData = async (studyId) => {
  const { data, error } = await supabase
    .from("StudyComment")
    .select("*")
    .eq("studyid", studyId);

  if (error) throw new Error(error.message);
  return data;
};

const DetailStudyPost = () => {
  const { studyId } = useParams();
  const { userData, allUserData, isLoading } = useDataContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [inputValue, setInputValue] = useState("");
  const [liked, setLiked] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: Study = [], isLoading: isStudyLoading } = useQuery({
    queryKey: ["Study", studyId],
    queryFn: () => fetchStudyData(studyId),
  });

  const { data: studyLike = [], isLoading: isLikeLoading } = useQuery({
    queryKey: ["studyLike", studyId],
    queryFn: () => fetchStudyLikeData(studyId),
    onError: (error) => console.log(error.message),
  });

  const { data: studyComments = [], isLoading: isCommentLoading } = useQuery({
    queryKey: ["studyComments", studyId],
    queryFn: () => fetchStudyCommentData(studyId),
  });

  useEffect(() => {
    setInputValue("");
    const checkLike = () => {
      const userLike = studyLike.find(
        (like) => like.userid === userData.userid
      );
      setLiked(!!userLike);
    };
    if (userData) {
      checkLike();
    }
  }, [studyLike]);

  const mutation = useMutation({
    mutationFn: async (newComment) => {
      const { data, error } = await supabase
        .from("StudyComment")
        .insert([newComment]);
      if (error) throw new Error(error.message);

      return data;
    },
    onMutate: async (newComment) => {
      await queryClient.cancelQueries(["studyComments", studyId]);

      const previousComments = queryClient.getQueryData([
        "studyComments",
        studyId,
      ]);

      queryClient.setQueryData(["studyComments", studyId], (old) => [
        ...old,
        { ...newComment, createdat: new Date().toISOString() },
      ]);

      return { previousComments };
    },
    onError: (err, newComment, context) => {
      queryClient.setQueryData(
        ["studyComments", studyId],
        context.previousComments
      );
    },
    onSettled: () => {
      setInputValue("");
      queryClient.invalidateQueries(["studyComments", studyId]);
    },
  });

  if (isLoading || isStudyLoading || isLikeLoading || isCommentLoading) {
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

  const study = Study.find((study) => study.studyid === Number(studyId));
  const author = allUserData.find((user) => user.userid === study.userid);

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

  //좋아요
  const toggleLike = async () => {
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

    const userId = session.user.id;

    if (liked) {
      await supabase.from("StudyLike").delete().eq("studyid", studyId);
      setLiked(false);
    } else {
      await supabase.from("StudyLike").insert([
        {
          studyid: studyId,
          createdat: new Date(),
          userid: userId,
        },
      ]);
      setLiked(true);
    }
  };

  //공유
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

  //댓글 등록
  const registerClick = async (event) => {
    if (!userData) {
      alert("로그인 후에 댓글을 등록할 수 있습니다.");
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
      studyid: studyId,
      userid: userId,
      content: inputValue,
      createdat: new Date(),
      updatedat: new Date(),
    };

    mutation.mutate(newComment);
  };

  const handleReviseClick = () => {
    // navigate(`/revise-study/${studyId}`);
    alert("수정기능을 구현중입니다");
    return;
  };

  const handleRemoveClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteClick = async () => {
    const { data, error } = await supabase
      .from("Study")
      .delete()
      .eq("studyid", studyId);

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

  const handleCommentDelete = (commentId) => {
    const updatedComments = studyComments.filter(
      (comment) => comment.commentid !== commentId
    );
    queryClient.setQueryData(["studyComments", studyId], updatedComments);
  };

  const handleProfileClick = (item) => {
    navigate(`/profile/${item}`);
  };

  return (
    <div>
      <Header title={"Studies"} />
      {isDeleteModalOpen && (
        <DeleteModal
          title={"Study"}
          onDelete={handleDeleteClick}
          onCancel={handleCancelClick}
        />
      )}
      <div
        style={{ marginTop: "60px", marginLeft: "100px", marginRight: "300px" }}
      >
        {study.completion === "모집 중" ? (
          <div className={styles.studiesStatus}>{study.completion}</div>
        ) : (
          <div className={styles.studiesStatus2}>{study.completion}</div>
        )}
        <div className={styles.studiesTitle}>{study.title}</div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "14px",
            marginTop: "30px",
          }}
          onClick={() => handleProfileClick(author?.nickname)}
        >
          <img
            className={styles.postWriterProfile}
            src={author?.profileimage || noprofile}
            alt="noprofile"
          />
          <div className={styles.postWriterNickname}>
            {author?.nickname || "nickname"}
          </div>
          <div className={styles.postWriteDate}>
            {new Date(study.createdat).toLocaleDateString()}
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
          {userData && userData.userid === study.userid && (
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
            <div className={styles.studiesDetailIndex}>진행 방식</div>
            <div className={styles.studiesDetail}>{study.proceed}</div>
          </div>
          <div className={styles.studiesDetails}>
            <div className={styles.studiesDetailIndex}>모집인원</div>
            <div className={styles.studiesDetail}>{study.maxmembers}</div>
          </div>
          {study.location !== null && (
            <div className={styles.studiesDetails}>
              <div className={styles.studiesDetailIndex}>장소</div>
              <div className={styles.studiesDetail}>
                {study.location || "X"}
              </div>
            </div>
          )}

          <div className={styles.studiesDetails}>
            <div className={styles.studiesDetailIndex}>기간</div>
            <div className={styles.studiesDetail}>{study.duration}</div>
          </div>
          <div className={styles.studiesDetails}>
            <div className={styles.studiesDetailIndex}>일정</div>
            <div className={styles.studiesDetail}>{study.schedule}</div>
          </div>
          {study.tag.length !== 0 && (
            <div className={styles.studiesDetails}>
              <div className={styles.studiesDetailIndex}>태그</div>
              {study.tag.map((tag, index) => (
                <div className={styles.studiesDetail}>{tag}</div>
              ))}
            </div>
          )}
        </div>
        <div style={{ marginTop: "70px" }}>
          <div className={styles.studiesIntro}>스터디 소개</div>
          <div className={styles.studiesContent}>
            {formatDescription(study.description)}
          </div>
        </div>

        <div style={{ marginTop: "70px" }}>
          <div className={styles.studiesComments}>
            <div className={styles.studiesComment}>
              댓글 {studyComments.length}개
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
                className={styles.shareIcon}
                src={share}
                alt="share"
                onClick={toggleShare}
              />
            </div>
          </div>

          <div style={{ padding: "30px 30px 30px 30px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "40px",
              }}
            >
              {studyComments.map((comment, index) => (
                <StudyComment
                  key={comment.commentid}
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
export default DetailStudyPost;
