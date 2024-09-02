import React, { useEffect, useState } from "react";
import styles from "./Communities.module.css";
import Header from "components/Header";
import Classification from "components/Communities/Classification";
import JoinCommunity from "components/Communities/JoinCommunity";
import PostList from "components/Communities/CommunityPostList";
import JoinPostList from "components/Communities/CommunityJoinPostList";
import { dummyPostData } from "components/Dummydata";
import { useAuth } from "contexts/AuthContext";
import supabase from "components/supabaseClient";

const Communities = () => {
  const [selectedEvent, setSelectEvent] = useState('');
  const [user, setUser] = useState([]);
  const [community, setCommunity] = useState([]);
  const [post, setPost] = useState([]);
  const [comment, setComment] = useState([]);
  const { user: sessionUser } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (sessionUser) {
        const { data, error } = await supabase
          .from("User")
          .select("*");

        if (error) {
          console.error("Error", error);
        } else {
          setUser(data);
        }
      }
    };

    const fetchCommunityData = async () => {
      if (sessionUser) {
        const { data, error } = await supabase
          .from("Community")
          .select("*")
          .eq("createdby", sessionUser.id);

        if (error) {
          console.error("Error", error);
        } else {
          setCommunity(data);
        }
      }
    };

    const fetchPostData = async () => {
      if (sessionUser) {
        const { data, error } = await supabase
          .from("Post")
          .select("*");

        if (error) {
          console.error("Error", error);
        } else {
          setPost(data);
        }
      }
    };

    const fetchCommentData = async () => {
      if (sessionUser) {
        const { data, error } = await supabase
          .from("Comment")
          .select("*")
          .eq("postid", post.postid);

        if (error) {
          console.error("Error", error);
        } else {
          setComment(data);
        }
      }
    };

    fetchUserData();
    fetchCommunityData();
    fetchPostData();
    fetchCommentData();
  }, [sessionUser]);

  const handleEventSelect = (event) => {
    setSelectEvent(event);
  };


  return (
    <div className={styles.community}>
      <Header headerName={'Communities'} />
      {community.length > 0 ? (
        <>
          <div className={styles.classification}>
            <JoinCommunity onEventSelect={handleEventSelect} communityInfo={community} />
          </div>
          <JoinPostList postData={post} communityData={community} userData={user} commentData={comment} />
        </>
      ) : (
        <>
          <div className={styles.classification}>
            <Classification onEventSelect={handleEventSelect} />
          </div>
          <PostList postData={dummyPostData} selectedEvent={selectedEvent} />
        </>
      )}
    </div>
  );
};

export default Communities;
