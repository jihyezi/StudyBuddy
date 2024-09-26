import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from './Profile.module.css';
import Header from "components/Header";
import ProfileTablist from "components/Profile/ProfileTablist";
import supabase from "components/supabaseClient";
import nobackground from "assets/images/Profile/nobackground.png";
import noprofile from "assets/images/Profile/noprofile.png";
import logo from "assets/icons/Sidebar/studybuddyLogo.png"
import loadinggif from "assets/images/loading.gif"
import { useAuth } from "contexts/AuthContext";

const Profile = () => {
  const location = useLocation();
  const communityInfo = { ...location.state };
  const { user: sessionUser } = useAuth(); // 현재 로그인된 유저 정보 가져오기
  const [user, setUser] = useState(null);
  const [imageUrl, setImageUrl] = useState(noprofile);
  const [backgroundUrl, setBackgroundUrl] = useState(nobackground);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    const fetchUserData = async () => {
      if (sessionUser) {
        try {
          setLoading(true); // 로딩 시작
          console.log("sessionUser:", sessionUser); // sessionUser 정보 로그 출력

          const { data, error } = await supabase
            .from("User")
            .select("bio, birthdate, email, nickname, profileimage, username, backgroundimage")
            .eq("userid", sessionUser.id)
            .maybeSingle(); // 단일 결과를 가져오도록 수정

          if (error) {
            console.error("Error fetching user data:", error);
          } else if (!data) {
            console.error("User data not found."); // 유저 데이터를 찾지 못한 경우 처리
          } else {
            console.log("Fetched user data:", data); // 유저 데이터 로그 출력
            setUser(data);
          }
        } catch (err) {
          console.error("Unexpected error:", err);
        } finally {
          setLoading(false); // 로딩 종료
        }
      } else {
        console.log("No sessionUser found."); // sessionUser가 없는 경우 로그 출력
        setLoading(false); // sessionUser가 없을 때 로딩 종료
      }
    };

    fetchUserData();
  }, [sessionUser]);

  if (loading) {
    return <div style={{ display: 'flex', width: '100%', height: '100vh', justifyContent: 'center', alignItems: 'center' }}><img src={loadinggif} style={{ width: '80px' }} /></div>;
  }

  if (!sessionUser) {
    return <div> </div>;
  }

  if (!user) {
    return <div>User data not found.</div>;
  }

  return (
    <div className={styles.container}>
      <Header headerName={user.nickname} />
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div className={styles.info}>
          <div className={styles.imageWrapper}>
            {user.backgroundimage ?
              <img src={user.backgroundimage} alt="profile background" className={styles.image} />
              : <img src={nobackground} alt="profile background" className={styles.image} />
            }
            <div className={styles.profileImgContainer}>
              {user.profileimage ?
                <img src={user.profileimage} alt="profile" className={styles.profileImg} />
                : <img src={noprofile} alt="profile" className={styles.profileImg} />
              }

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
          <ProfileTablist />
        </div>

      </div>



    </div>
  );
};

export default Profile;