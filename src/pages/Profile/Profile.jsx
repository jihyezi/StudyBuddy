import React, { useState, useMemo } from "react";
import styles from './Profile.module.css';
import supabase from "components/supabaseClient";

// Components
import Header from "components/Header";
import ProfileTablist from "components/Profile/ProfileTablist";
import ProfileEditModal from "components/Profile/ProfileEditModal";

// Images
import nobackground from "assets/images/Profile/nobackground.png";
import noprofile from "assets/images/Profile/noprofile.png";
import loadinggif from "assets/images/loading.gif"
import { useQuery } from "@tanstack/react-query";

// Data
const fetchUserPostData = async (userId) => {
  const { data, error } = await supabase
    .from("Post")
    .select("*")
    .eq('userid', userId);

  if (error) throw new Error(error.message);
  return data;
};

const fetchUserCommentData = async (userId) => {
  const { data, error } = await supabase
    .from("Comment")
    .select("*")
    .eq("userid", userId);

  if (error) throw new Error(error.message);
  return data;
};

const fetchUserLikeData = async (userId) => {
  const { data, error } = await supabase
    .from("PostLike")
    .select("postid")
    .eq("userid", userId);

  if (error) throw new Error(error.message);
  return data;
};

const Profile = ({ userData, allUserData, communityData, postData, refetchUserData, isLoading }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const { data: userPost = [], isLoading: isPostLoading } = useQuery({
    queryKey: ['userPost', userData?.userid],
    queryFn: () => fetchUserPostData(userData.userid),
    onError: (error) => console.error(error.message),
  });

  const { data: userComment = [], isLoading: isCommentLoading } = useQuery({
    queryKey: ['userComment', userData?.userid],
    queryFn: () => fetchUserCommentData(userData.userid),
    onError: (error) => console.error(error.message),
  });

  const { data: userLike = [], isLoading: isLikeLoading } = useQuery({
    queryKey: ['userLike', userData?.userid],
    queryFn: () => fetchUserLikeData(userData.userid),
    onError: (error) => console.error(error.message),
  });

  const filterLikePost = useMemo(() => {
    return postData ? postData.filter((postItem) =>
      userLike.some((likeItem) => likeItem.postid === postItem.postid)
    ) : []
  }, [userLike, postData]);

  const filterCommentPost = useMemo(() => {
    return postData ? postData.filter((postItem) =>
      userComment.some((likeItem) => likeItem.postid === postItem.postid)
    ) : []
  }, [userComment, postData]);

  const loading = isLoading || isPostLoading || isCommentLoading || isLikeLoading;

  return (
    <div className={styles.container}>
      {loading ? (
        <div style={{ display: 'flex', width: '100%', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
          <img src={loadinggif} style={{ width: '80px' }} alt="Loading" />
        </div>
      ) : !userData ? (
        <div></div>
      ) : (
        <>
          <Header headerName={userData.nickname} />
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div className={styles.info}>
              <div className={styles.imageWrapper}>
                {userData.backgroundimage ?
                  <img src={userData.backgroundimage} alt="profile background" className={styles.image} />
                  : <img src={nobackground} alt="profile background" className={styles.image} />
                }
                <div className={styles.profileImgContainer}>
                  {userData.profileimage ?
                    <img src={userData.profileimage} alt="profile" className={styles.profileImg} />
                    : <img src={noprofile} alt="profile" className={styles.profileImg} />
                  }
                </div>
              </div>

              <div className={styles.details}>
                <div className={styles.edit}>
                  <div className={styles.communityName}></div>
                  <button className={styles.joinButton} onClick={openModal}>
                    Edit
                  </button>
                  <ProfileEditModal
                    modalIsOpen={modalIsOpen}
                    closeModal={closeModal}
                    userData={userData}
                    refetchUserData={refetchUserData}
                  />
                </div>
                <div className={styles.infoList}>
                  <span className={styles.description1}>{userData.nickname}</span>
                  <span className={styles.description2}>@{userData.username}</span>
                  <span className={styles.description3}>{userData.bio}</span>
                  <span className={styles.description4}>
                    {userData.birthdate ? `🎂 ${userData.birthdate}` : null}
                  </span>
                </div>
              </div>
              <ProfileTablist
                communityData={communityData}
                allUserData={allUserData}
                userPost={userPost}
                userLike={filterLikePost}
                userComment={filterCommentPost}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;