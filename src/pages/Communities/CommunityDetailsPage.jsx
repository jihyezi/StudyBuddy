import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import styles from "./CommunityDetailsPage.module.css";
import TabList from "components/Communities/TabList";

import imgbackground from "assets/images/bookmarkbackground.png";
import commmunityicon from "assets/icons/palette.png";
import Header from "components/Header";
import supabase from "components/supabaseClient";

const CommunityDetailsPage = () => {
  const { communityId } = useParams();
  const location = useLocation();
  const communityInfo = { ...location.state };

  const [isJoined, setIsJoined] = useState(false);
  const [joinCommunity, setJoinCommunity] = useState(null);
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);

  const handleJoinClick = () => {
    setIsJoined(!isJoined);
  };

  const fetchCommunityDataById = async (communityId) => {
    const { data, error } = await supabase
      .from("Community")
      .select("*")
      .eq("communityid", communityId);

    if (error) {
      console.error("Error fetching data:", error);
    } else {
      setCommunity(data);
    }
  };

  const fetchJoinCommunityDataById = async () => {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError) {
      console.error("Error getting session:", sessionError);
      return;
    }

    const userId = session.user.id;

    const { data, error } = await supabase
      .from("JoinCommunity")
      .select("*")
      .eq("userid", userId)
      .eq("communityid", communityId);

    if (error) {
      console.error("Error fetching data:", error);
    } else {
      setJoinCommunity(data);
      if (data.length > 0) {
        setIsJoined(true);
      }
    }
  };

  const fetchPostDataById = async (communityId) => {
    const { data, error } = await supabase
      .from("Post")
      .select("*")
      .eq("communityid", communityId);

    if (error) {
      console.error("Error fetching data:", error);
    } else {
      setPosts(data);
    }
  };

  useEffect(() => {
    fetchCommunityDataById(communityId);
    fetchJoinCommunityDataById();
    fetchPostDataById(communityId);
  }, [communityId]);

  if (!community || !posts) {
    return <div>Loading...</div>;
  }

  const userRole =
    joinCommunity && joinCommunity.length > 0 ? joinCommunity[0].role : null;

  return (
    <div className={styles.container}>
      <Header headerName={community[0].name} />
      <div className={styles.imageWrapper}>
        <div className={styles.imageContainer}>
          <img
            src={community[0].image}
            alt="profile"
            className={styles.image}
          />
        </div>
        <div className={styles.iconWrapper}>
          <div className={styles.communityPostIconWrapper}>
            <img
              src={imgbackground}
              className={styles.communityPostIconBackground}
            />
            <img
              src={commmunityicon}
              className={styles.communityPostIconPalette}
            />
          </div>
        </div>
      </div>

      <div className={styles.details}>
        <div className={styles.header}>
          <div className={styles.communityName}>{community[0].name}</div>
          {userRole === "admin" ? (
            <button className={styles.joinButton}>수정</button>
          ) : (
            <button
              className={isJoined ? styles.joinButtonActive : styles.joinButton}
              onClick={handleJoinClick}
            >
              {isJoined ? "나가기" : "가입"}
            </button>
          )}
        </div>
        <div className={styles.description}>{community[0].description}</div>
      </div>
      <TabList />
    </div>
  );
};

export default CommunityDetailsPage;
