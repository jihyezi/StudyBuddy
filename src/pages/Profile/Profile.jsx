import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import styles from './Profile.module.css';
import Header from "components/Communities/Header";
import background from 'assets/images/profilebackground.jpeg';
import profile from 'assets/images/faker2.jpg';
import ProfileTablist from "components/Profile/ProfileTablist";

const Profile = () => {
  const location = useLocation();
  const communityInfo = { ...location.state };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.info}>
        <div className={styles.imageWrapper}>
          <img src={background} alt="profile background" className={styles.image} />
          <div className={styles.profileImgContainer}>
            <img src={profile} alt="profile" className={styles.profileImg} />
          </div>
        </div>

        <div className={styles.details}>
          <div className={styles.edit}>
            <div className={styles.communityName}>{communityInfo.community}</div>
            <button className={styles.joinButton}>Edit</button>
          </div>
          <div className={styles.infoList}>
            <span className={styles.description1}>페이커</span>
            <span className={styles.description2}>@Faker</span>
            <span className={styles.description3}>정보처리기사 자격증 준비하고 있는 취준생입니다~~~~~~~~🤩</span>
          </div>
        </div>
      </div>

      <ProfileTablist />
    </div>
  )
}

export default Profile;
