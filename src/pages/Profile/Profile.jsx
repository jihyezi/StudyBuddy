import React, { useState, useMemo } from "react";
import styles from './Profile.module.css';
import supabase from "components/supabaseClient";
import { useDataContext } from "api/DataContext";
import { useAuth } from "contexts/AuthContext";
import { useParams } from "react-router-dom";

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
    .eq("userid", userId);

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

const Profile = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { userData, allUserData, communityData, postData, refetchUserData, isLoading } = useDataContext();
  const { user: sessionUser } = useAuth();
  const { username } = useParams();

  const currentProfileData = useMemo(() => {
    if (userData?.username === username) {
      return userData;
    }
    return allUserData?.find((user) => user.username === username) || null;
  }, [userData, username, allUserData]);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    refetchUserData();
  };

  const { data: userPost = [], isLoading: isPostLoading } = useQuery({
    queryKey: ['userPost', currentProfileData?.userid],
    queryFn: () => fetchUserPostData(currentProfileData.userid),
    onError: (error) => console.error(error.message),
  });

  const { data: userComment = [], isLoading: isCommentLoading } = useQuery({
    queryKey: ['userComment', currentProfileData?.userid],
    queryFn: () => fetchUserCommentData(currentProfileData.userid),
    onError: (error) => console.error(error.message),
  });

  const { data: userLike = [], isLoading: isLikeLoading } = useQuery({
    queryKey: ['userLike', currentProfileData?.userid],
    queryFn: () => fetchUserLikeData(currentProfileData.userid),
    onError: (error) => console.error(error.message),
  });

  const filterLikePost = useMemo(() => {
    return postData ? postData.filter((postItem) =>
      userLike.some((likeItem) => likeItem.postid === postItem.postid)
    ) : []
  }, [userData, userLike, postData]);

  const filterCommentPost = useMemo(() => {
    return postData ? postData.filter((postItem) =>
      userComment.some((likeItem) => likeItem.postid === postItem.postid)
    ) : []
  }, [userData, userComment, postData]);

  const loading = isLoading || isPostLoading || isCommentLoading || isLikeLoading;

  console.log(userPost)
  console.log(currentProfileData.userid)

  return (
    <div className={styles.container}>
      {loading ? (
        <div style={{ display: 'flex', width: '100%', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
          <img src={loadinggif} style={{ width: '80px' }} alt="Loading" />
        </div>
      ) : !currentProfileData ? (
        <div>No profile data found.</div>
      ) : (
        <>
          <Header headerName={currentProfileData.nickname} />
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingBottom: '20px' }}>
            <div className={styles.info}>
              <div className={styles.imageWrapper}>
                {currentProfileData.backgroundimage ?
                  <img src={currentProfileData.backgroundimage} alt="profile background" className={styles.image} />
                  : <img src={nobackground} alt="profile background" className={styles.image} />
                }
                <div className={styles.profileImgContainer}>
                  {currentProfileData.profileimage ?
                    <img src={currentProfileData.profileimage} alt="profile" className={styles.profileImg} />
                    : <img src={noprofile} alt="profile" className={styles.profileImg} />
                  }
                </div>
              </div>

              <div className={styles.details}>
                {sessionUser && sessionUser.id === currentProfileData.userid ? (
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
                ) : (
                  <div className={styles.noedit}></div>
                )}
                <div className={styles.infoList}>
                  <span className={styles.description1}>{currentProfileData.nickname}</span>
                  <span className={styles.description2}>@{currentProfileData.username}</span>
                  <span className={styles.description3}>{currentProfileData.bio}</span>
                  <span className={styles.description4}>
                    {currentProfileData.birthdate ? `🎂 ${currentProfileData.birthdate}` : null}
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