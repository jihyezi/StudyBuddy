import React, { useState, useEffect } from "react";
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

const Profile = ({ userData, allUserData, communityData, postData, isLoading }) => {
  const [userPost, setUserPost] = useState([]);
  const [userComment, setUserComment] = useState([]);
  const [userLike, setUserLike] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  useEffect(() => {
    const fetchUserPostData = async () => {
      if (userData) {
        const { data, error } = await supabase
          .from("Post")
          .select("*")
          .eq('userid', userData.userid);

        if (error) {
          console.error("Error", error);
        } else {
          setUserPost(data);
        }
      }
    };

    const fetchUserCommentData = async () => {
      if (userData) {
        const { data, error } = await supabase
          .from("Comment")
          .select("*")
          .eq("userid", userData.userid);

        if (error) {
          console.error("Error", error);
        } else {
          setUserComment(data);
        }
      }
    };

    const fetchUserLikeData = async () => {
      if (userData) {
        const { data, error } = await supabase
          .from("PostLike")
          .select("postid")
          .eq('userid', userData.userid);

        if (error) {
          console.error("Error", error);
        } else {
          setUserLike(data);
        }
      }
    };

    fetchUserPostData();
    fetchUserCommentData();
    fetchUserLikeData();
  }, [userData]);

  const filterLikePost = postData.filter((postItem) =>
    userLike.some((likeItem) => likeItem.postid === postItem.postid)
  );

  const filterCommentPost = postData.filter((postItem) =>
    userComment.some((likeItem) => likeItem.postid === postItem.postid)
  );

  return (
    <div className={styles.container}>
      {isLoading ? (
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
                    profileImg={userData.profileimage}
                    backgroundimage={userData.backgroundimage}
                    userData={userData}
                    userNickname={userData.nickname}
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
                community={communityData}
                allUser={allUserData}
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