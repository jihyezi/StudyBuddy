import React, { useMemo, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import styles from "./Communities.module.css";

// Components
import Header from "components/Header";
import Classification from "components/Communities/Classification";
import JoinCommunity from "components/Communities/JoinCommunity";
import CommunityJoinPostList from "components/Communities/CommunityJoinPostList";
import supabase from "components/supabaseClient";
import { useDataContext } from "api/DataContext";

// Images
import loadinggif from "assets/images/loading.gif";

// Data
const fetchJoinCommunityData = async (userId) => {
  if (userId) {
    const { data, error } = await supabase
      .from("JoinCommunity")
      .select("*")
      .eq("userid", userId);

    if (error) {
      throw new Error(error.message);
    }
    return data;
  } else {
    return [];
  }
};

const fetchCommentData = async (postId) => {
  const { data, error } = await supabase
    .from("Comment")
    .select("*")
    .eq("postid", postId);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

const Communities = ({}) => {
  const { userData, communityData, postData, isLoading } = useDataContext();
  const [selectedEvent, setSelectEvent] = useState("");

  const { data: joinCommunityData = [], isLoading: isJoinCommunityLoading } =
    useQuery({
      queryKey: ["joinCommunityData", userData?.userid],
      queryFn: () => fetchJoinCommunityData(userData.userid),
      onError: (error) => console.error(error.message),
    });

  const { data: commentData = [] } = useQuery({
    queryKey: ["commentData", userData?.userid],
    queryFn: () => fetchCommentData(postData.postid),
    onError: (error) => console.error(error.message),
  });

  const handleEventSelect = useCallback((event) => {
    setSelectEvent(event);
  }, []);

  const filterCommunity = useMemo(() => {
    return communityData && joinCommunityData
      ? communityData.filter((c) =>
          joinCommunityData.some((jc) => jc.communityid === c.communityid)
        )
      : [];
  }, [communityData, joinCommunityData]);

  const filteredPosts = useMemo(() => {
    return postData && filterCommunity
      ? postData.filter((p) =>
          filterCommunity.some(
            (fc) => Number(fc.communityid) === Number(p.communityid)
          )
        )
      : [];
  }, [postData, filterCommunity]);

  const filteredCommunities = useMemo(() => {
    return communityData
      ? selectedEvent === "🔥"
        ? communityData
        : communityData.filter((c) => c.field === selectedEvent)
      : [];
  }, [communityData, selectedEvent]);

  const filterfieldPosts = useMemo(() => {
    return postData && communityData
      ? selectedEvent === "🔥"
        ? postData
        : postData.filter((p) =>
            filteredCommunities.some(
              (fc) => Number(fc.communityid) === Number(p.communityid)
            )
          )
      : [];
  }, [postData, communityData, selectedEvent, filteredCommunities]);

  const loading = isLoading || isJoinCommunityLoading;

  return (
    <div className={styles.community}>
      <Header headerName={"Communities"} />
      {loading ? (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100vh",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={loadinggif} style={{ width: "80px" }} alt="Loading" />
        </div>
      ) : joinCommunityData.length > 0 ? (
        <>
          <div className={styles.classification1}>
            <JoinCommunity
              onEventSelect={handleEventSelect}
              joinCommunityData={filterCommunity}
            />
          </div>
          <CommunityJoinPostList postData={filteredPosts} />
        </>
      ) : (
        <>
          <div className={styles.classification2}>
            <Classification onEventSelect={handleEventSelect} />
          </div>
          {filterfieldPosts.length > 0 ? (
            <CommunityJoinPostList postData={filterfieldPosts} />
          ) : (
            <div className={styles.nopostcontainer}>
              <div className={styles.nopost}>No Posts Yet</div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Communities;
