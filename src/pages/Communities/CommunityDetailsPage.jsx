import React, { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "./CommunityDetailsPage.module.css";
import supabase from "components/supabaseClient";
import { useAuth } from "contexts/AuthContext";
import { useDataContext } from "api/DataContext";

// Components
import TabList from "components/Communities/TabList";
import Header from "components/Header";
import CommunityField from "components/Communities/CommunityField";

// Images
import imgbackground from "assets/images/bookmarkbackground.png";
import nobackground from "assets/images/Profile/nobackground.png";
import loadinggif from "assets/images/loading.gif";

export const fetchCommunityData = async (communityId) => {
  const { data, error } = await supabase
    .from("Community")
    .select("*")
    .eq("communityid", communityId);

  if (error) throw new Error("Faled to fetch user data");
  return data;
};

const fetchJoinCommunityData = async ({ userId, communityId }) => {
  const { data, error } = await supabase
    .from("JoinCommunity")
    .select("*")
    .eq("userid", userId)
    .eq("communityid", communityId);

  if (error) throw new Error(error.message);
  return data;
};

const CommunityDetailsPage = ({}) => {
  const { communityId } = useParams();
  const { userData, allUserData, postData, isLoading } = useDataContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userId = userData.userid;

  const { data: Community = [], isLoading: isCommunityLoading } = useQuery({
    queryKey: ["Community", communityId],
    queryFn: () => fetchCommunityData(communityId),
  });

  const { data: joinCommunity = [], isLoading: isJoinCommunityLoading } =
    useQuery({
      queryKey: ["joinCommunity", { userId, communityId }],
      queryFn: () => fetchJoinCommunityData({ userId, communityId }),
      enabled: !!userId,
    });

  if (isLoading || isCommunityLoading || isJoinCommunityLoading) {
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

  const isJoined = joinCommunity && joinCommunity.length > 0;

  const handleJoinClick = async () => {
    if (isJoined) {
      const { error } = await supabase
        .from("JoinCommunity")
        .delete()
        .eq("userid", userId)
        .eq("communityid", communityId);

      if (error) {
        console.error("Error leaving community:", error);
      } else {
        queryClient.invalidateQueries(["joinCommunity", userId, communityId]);
        console.log("Successfully left the community");
      }
    } else {
      const { error } = await supabase
        .from("JoinCommunity")
        .insert([{ userid: userId, communityid: communityId }]);

      if (error) {
        console.error("Error joining community:", error);
      } else {
        queryClient.invalidateQueries(["joinCommunity", userId, communityId]);
        console.log("Successfully joined the community");
      }
    }
  };

  const userRole =
    joinCommunity && joinCommunity.length > 0 ? joinCommunity[0].role : null;

  const handleReviseClick = () => {
    navigate(`/revise-study/${communityId}`);
    // alert("수정기능을 구현중입니다");
    // return;
  };

  return (
    <div className={styles.container}>
      <Header headerName={Community[0].name} />
      <div className={styles.imageWrapper}>
        <div className={styles.imageContainer}>
          {Community[0].image ? (
            <img
              src={Community[0].image}
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
            <CommunityField field={Community[0].field} />
          </div>
        </div>
      </div>

      <div className={styles.details}>
        <div className={styles.header}>
          <div className={styles.communityName}>{Community[0].name}</div>
          {userRole === "admin" ? (
            <button className={styles.joinButton} onClick={handleReviseClick}>
              수정
            </button>
          ) : (
            <button
              className={isJoined ? styles.joinButtonActive : styles.joinButton}
              onClick={handleJoinClick}
            >
              {isJoined ? "나가기" : "가입"}
            </button>
          )}
        </div>
        <div className={styles.description}>{Community[0].description}</div>
      </div>
      <TabList
        communityData={Community}
        userData={userData}
        postData={postData}
        allUserData={allUserData}
        joinCommunityData={joinCommunity}
      />
    </div>
  );
};

export default CommunityDetailsPage;
