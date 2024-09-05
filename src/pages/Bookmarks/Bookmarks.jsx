import React, { useEffect, useState, useRef } from "react";
import supabase from "components/supabaseClient";
import styles from "./Bookmarks.module.css";

// component
import Header from "components/Header";
import Classification from "components/Communities/Classification";
import JoinCommunity from "components/Communities/JoinCommunity";
import CommunityDetailClick from "components/Communities/CommunityDetailClick";
import Post from "components/Communities/Post";
import PostList from "components/Communities/CommunityPostList";
import JoinPostList from "components/Communities/CommunityJoinPostList";
import Recommended from "pages/Recommended/Recommended";
import { dummyPostData } from "components/Dummydata";
import BookmarkJoin from "components/Bookmark/BookmarkJoin";

const Bookmarks = () => {
  const [postData, setPostData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className={styles.community}>
      <Header headerName={"Bookmarks"} />
      <div className={styles.classification}>
        <BookmarkJoin />
      </div>

      {loading ? <p>Loading...</p> : <JoinPostList postData={postData} />}
    </div>
  );
};

export default Bookmarks;
