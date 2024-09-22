import React, { useEffect, useState, useRef } from "react";
import supabase from "components/supabaseClient";
import styles from "./Bookmarks.module.css";
import { useAuth } from "contexts/AuthContext";

// component
import Header from "components/Header";
import Classification from "components/Communities/Classification";
import JoinCommunity from "components/Communities/JoinCommunity";
import CommunityDetailClick from "components/Communities/CommunityDetailClick";
import Post from "components/Communities/Post";
import PostList from "components/Communities/CommunityPostList";
import JoinPostList from "components/Communities/CommunityJoinPostList";
import Recommended from "pages/Recommended/Recommended";
import BookmarkJoin from "components/Bookmark/BookmarkJoin";

const Bookmarks = () => {
  const [postData, setPostData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectEvent] = useState("");
  const [user, setUser] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [community, setCommunity] = useState([]);
  const [allJoinCommunity, setAllJoinCommunity] = useState([]);
  const [joinCommunity, setJoinCommunity] = useState([]);
  const [post, setPost] = useState([]);
  const [comment, setComment] = useState([]);
  const { user: sessionUser } = useAuth();

  useEffect(() => {
    const fetchBookmarks = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Error getting session:", sessionError);
        return;
      }

      const userId = session.user.id;

      if (userId) {
        const { data: bookmarks, error: bookmarkError } = await supabase
          .from("Bookmark")
          .select("postid")
          .eq("userid", userId);

        if (bookmarkError) {
          console.error(bookmarkError);
          setLoading(false);
          return;
        }

        const postIds = bookmarks.map((b) => b.postid);
        const { data: posts, error: postError } = await supabase
          .from("Post")
          .select("*")
          .in("postid", postIds);

        if (postError) {
          console.error(postError);
        } else {
          setPostData(posts);
        }
      }
      setLoading(false);
    };

    fetchBookmarks();
  }, []);

  const handleBookmarkToggle = (postId) => {
    setPostData((prevPosts) =>
      prevPosts.filter((post) => post.postid !== postId)
    );
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (sessionUser) {
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
          .from("User")
          .select("*")
          .eq("userid", userId);

        if (error) {
          console.error("Error", error);
        } else {
          setUser(data);
        }
      }
    };

    const fetchAllUserData = async () => {
      const { data, error } = await supabase.from("User").select("*");

      if (error) {
        console.error("Error", error);
      } else {
        setAllUser(data);
      }
    };

    const fetchCommunityData = async () => {
      if (sessionUser) {
        const { data, error } = await supabase.from("Community").select("*");

        if (error) {
          console.error("Error", error);
        } else {
          setCommunity(data);
        }
      }
    };

    const fetchAllJoinCommunityData = async () => {
      if (sessionUser) {
        const { data, error } = await supabase
          .from("JoinCommunity")
          .select("*");

        if (error) {
          console.error("Error", error);
        } else {
          setAllJoinCommunity(data);
        }
      }
    };

    const fetchJoinCommunityData = async () => {
      if (sessionUser) {
        const { data, error } = await supabase
          .from("JoinCommunity")
          .select("*")
          .eq("userid", sessionUser.id);

        if (error) {
          console.error("Error", error);
        } else {
          setJoinCommunity(data);
        }
      }
    };

    const fetchPostData = async () => {
      if (sessionUser) {
        const { data, error } = await supabase.from("Post").select("*");

        if (error) {
          console.error("Error", error);
        } else {
          setPost(data);
        }
      }
    };

    const fetchCommentData = async () => {
      if (sessionUser && post.postid) {
        const { data, error } = await supabase
          .from("Comment")
          .select("*")
          .eq("postid", post.postid);

        if (error) {
          console.error("Error", error);
        } else {
          console.log("data", data);
          setComment(data);
        }
      } else {
        console.warn("postid가 정의되지 않았습니다.");
      }
    };

    fetchUserData();
    fetchAllUserData();
    fetchCommunityData();
    fetchJoinCommunityData();
    fetchAllJoinCommunityData();
    fetchPostData();
    fetchCommentData();
  }, [sessionUser]);

  const handleEventSelect = (event) => {
    setSelectEvent(event);
  };

  const filterCommunity = community.filter((c) =>
    joinCommunity.some((jc) => jc.communityid === c.communityid)
  );

  const filteredPosts = post.filter((p) =>
    filterCommunity.some(
      (fc) => Number(fc.communityid) === Number(p.communityid)
    )
  );

  return (
    <div className={styles.community}>
      <Header headerName={"Bookmarks"} />
      <div className={styles.classification}>
        <BookmarkJoin
          onEventSelect={handleEventSelect}
          communityData={community}
          allJoinCommunityData={allJoinCommunity}
          joinCommunityData={filterCommunity}
          postData={post}
          userData={user}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <JoinPostList
          communityData={community}
          postData={postData}
          allUserData={allUser}
          userData={user}
          onBookmarkToggle={handleBookmarkToggle}
        />
      )}
    </div>
  );
};

export default Bookmarks;
