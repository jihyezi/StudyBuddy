import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from './Profile.module.css';
import Header from "components/Communities/Header";
import ProfileTablist from "components/Profile/ProfileTablist";
import supabase from "components/supabaseClient";
import nobackground from "assets/images/Profile/nobackground.png";
import noprofile from "assets/images/Profile/noprofile.png";

const Profile = () => {
  const location = useLocation();
  const communityInfo = { ...location.state };
  const [user, setUser] = useState(null);
  const [imageUrl, setImageUrl] = useState(noprofile);
  const [backgroundUrl, setBackgroundUrl] = useState(nobackground);
  const userId = "de25587a-369d-45f5-b5ea-e6abc43d0ab5";

  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from("User")
        .select("bio, birthdate, email, nickname, profileimage, username, backgroundimage")
        .eq("userid", userId)

      if (error) {
        console.error("Error fetching user data:", error);
      } else if (data && data.length > 0) {
        const userData = data[0];
        setUser(userData);

        if (userData.profileimage) {
          const { data: imageUrlData } = supabase
            .storage
            .from('Images')
            .getPublicUrl(`profile/${userData.profileimage}`);

          setImageUrl(imageUrlData.publicUrl);
        } else {
          setImageUrl(noprofile);
        }


        if (userData.backgroundimage) {
          const { data: imageUrlData } = supabase
            .storage
            .from('Images/profile')
            .getPublicUrl(`profile/${userData.backgroundimage}`);

          setBackgroundUrl(imageUrlData.publicUrl);
        } else {
          setBackgroundUrl(nobackground);
        }

      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <Header headerName={user.nickname} />
      <div className={styles.info}>
        <div className={styles.imageWrapper}>
          <img src={backgroundUrl} alt="profile background" className={styles.image} />
          <div className={styles.profileImgContainer}>
            <img src={imageUrl} alt="profile" className={styles.profileImg} />
          </div>
        </div>

        <div className={styles.details}>
          <div className={styles.edit}>
            <div className={styles.communityName}>{communityInfo.community}</div>
            <button className={styles.joinButton}>Edit</button>
          </div>
          <div className={styles.infoList}>
            <span className={styles.description1}>{user.nickname}</span>
            <span className={styles.description2}>@{user.username}</span>
            <span className={styles.description3}>{user.bio}</span>
          </div>
        </div>
      </div>

      <ProfileTablist />
    </div>
  );
}

export default Profile;
