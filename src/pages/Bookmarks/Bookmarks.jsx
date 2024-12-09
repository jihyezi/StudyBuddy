import React, { useMemo, useState } from "react";
import styles from "./Bookmarks.module.css";
import supabase from "components/supabaseClient";
import { useAuth } from "contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";

// Components
import Header from "components/Header";
import JoinPostList from "components/Communities/CommunityJoinPostList";
import BookmarkJoin from "components/Bookmark/BookmarkJoin";

// Images
import loadinggif from "assets/images/loading.gif";

// Data

const fetchPostData = async () => {
  const { data, error } = await supabase.from("Post").select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

const fetchAllJoinCommunityData = async () => {
  const { data, error } = await supabase.from("JoinCommunity").select("*");
  if (error) throw new Error("fetching allJoinCommunityData error");
  return data;
};

const fetchBookmarks = async (userId) => {
  const { data, error } = await supabase
    .from("Bookmark")
    .select("postid")
    .eq("userid", userId);
  if (error) throw new Error("fetching bookmarks error");
  return data;
};

const Bookmarks = ({ userData, allUserData, communityData }) => {
  const { data: postData = [], isLoading: isPostLoading } = useQuery({
    queryKey: ["postData"],
    queryFn: fetchPostData,
    onError: (error) => console.error(error.message),
  });

  const { data: allJoinCommunityData } = useQuery({
    queryKey: ["allJoinCommunity", userData?.userid],
    queryFn: fetchAllJoinCommunityData,
    enabled: !!userData,
  });

  const { data: bookmarksData, isLoading: bookmarksLoading } = useQuery({
    queryKey: ["bookmarks", userData?.userid],
    queryFn: () => fetchBookmarks(userData?.userid),
    enabled: !!userData,
  });

  const postIds = useMemo(() => {
    return bookmarksData?.map((bookmark) => bookmark.postid);
  }, [bookmarksData]);

  const filterPost = useMemo(() => {
    return postData?.filter((post) => postIds?.includes(Number(post.postid)));
  }, [postData, postIds]);

  const filterBookmarkCommunity = useMemo(() => {
    return communityData?.filter((community) =>
      filterPost?.some((post) => post.communityid === community.communityid)
    );
  }, [communityData, filterPost]);

  return (
    <div className={styles.community}>
      <Header headerName={"Bookmarks"} />
      <div className={styles.classification}>
        <BookmarkJoin
          communityData={filterBookmarkCommunity}
          allJoinCommunityData={allJoinCommunityData}
          joinCommunityData={filterBookmarkCommunity}
          postData={filterPost}
          userData={userData}
          allUserData={allUserData}
        />
      </div>

      {bookmarksLoading || isPostLoading ? (
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
      ) : (
        <JoinPostList postData={filterPost} />
      )}
    </div>
  );
};

export default Bookmarks;
