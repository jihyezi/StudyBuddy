import React, { useState, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import styles from "./CommunityDetailsPage.module.css";
import supabase from "components/supabaseClient";

// Components
import TabList from "components/Communities/TabList";
import Header from "components/Header";
import CommunityField from "components/Communities/CommunityField";

// Images
import imgbackground from "assets/images/bookmarkbackground.png";
import nobackground from "assets/images/Profile/nobackground.png";
import loadinggif from "assets/images/loading.gif";

const CommunityDetailsPage = () => {
  const { communityId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { userData = {}, allUserData = [], communityData = [], postData = [], joinCommunityData = [] } = location.state || {};
  const [isJoined, setIsJoined] = useState(false);
  const queryClient = useQueryClient();
  const userId = userData.userid;

  const handleJoinClick = useMutation({
    mutationFn: async () => {
      if (isJoined) {
        const { error } = await supabase
          .from("JoinCommunity")
          .delete()
          .eq("userid", userId)
          .eq("communityid", communityId);

        if (error) throw new Error("Error leaving community", error);
      } else {
        const { error } = await supabase
          .from("JoinCommunity")
          .insert([{ userid: userId, communityid: communityId }]);

        if (error) throw new Error("Error joining community", error);
      }
    },
    onMutate: async () => {
      setIsJoined((prev) => !prev);
    },
    onError: (error) => {
      console.error(error);
      setIsJoined(isJoined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("joinCommunity");
    }
  })

  const filterCommunity = useMemo(() =>
    communityData.filter((c) => Number(c.communityid) === Number(communityId)
    ), [communityData, communityId]);
  const thisCommunity = filterCommunity.length > 0 ? filterCommunity[0] : null;

  if (!thisCommunity) {
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
        <img src={loadinggif} style={{ width: "80px" }} />
      </div>
    );
  }

  const userRole =
    joinCommunityData && joinCommunityData.length > 0 ? joinCommunityData[0].role : null;

  const handleReviseClick = () => {
    navigate(
      `/revisecommunity?communityData=${encodeURIComponent(
        JSON.stringify(thisCommunity)
      )}`
    );
  };

  return (
    <div className={styles.container}>
      <Header headerName={thisCommunity.name} />
      <div className={styles.imageWrapper}>
        <div className={styles.imageContainer}>
          {thisCommunity.image ? (
            <img
              src={thisCommunity.image}
              alt="profile"
              className={styles.image}
            />
          ) : (
            <img src={nobackground} alt="profile" className={styles.image} />
          )}
        </div>
        <div className={styles.iconWrapper}>
          <div className={styles.communityPostIconWrapper}>
            <img
              src={imgbackground}
              className={styles.communityPostIconBackground}
            />
            <CommunityField field={thisCommunity.field} />
          </div>
        </div>
      </div>

      <div className={styles.details}>
        <div className={styles.header}>
          <div className={styles.communityName}>{thisCommunity.name}</div>
          {userRole === "admin" ? (
            <button className={styles.joinButton} onClick={handleReviseClick}>
              수정
            </button>
          ) : (
            <button
              className={isJoined ? styles.joinButtonActive : styles.joinButton}
              onClick={() => handleJoinClick.mutate()}
            >
              {isJoined ? "나가기" : "가입"}
            </button>
          )}
        </div>
        <div className={styles.description}>{thisCommunity.description}</div>
      </div>
      <TabList communityData={communityData} userData={userData} postData={postData} allUserData={allUserData} joinCommunityData={joinCommunityData} />
    </div>
  );
};

export default CommunityDetailsPage;
