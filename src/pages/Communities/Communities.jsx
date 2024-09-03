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
  const [joinCommunity, setJoinCommunity] = useState([]);
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
          .select("*");

        if (error) {
          console.error("Error", error);
        } else {
          setCommunity(data);
        }
      }
    };

    const fetchJoinCommunityData = async () => {
      if (sessionUser) {
        const { data, error } = await supabase
          .from("Joincommunity")
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
      if (sessionUser && post.postid) {  // post.postid가 정의된 경우에만 실행
        const { data, error } = await supabase
          .from("Comment")
          .select("*")
          .eq("postid", post.postid);

        if (error) {
          console.error("Error", error);
        } else {
          setComment(data);
        }
      } else {
        console.warn("postid가 정의되지 않았습니다.");
      }
    };

    fetchUserData();
    fetchCommunityData();
    fetchJoinCommunityData();
    fetchPostData();
    fetchCommentData();
  }, [sessionUser]);

  const handleEventSelect = (event) => {
    setSelectEvent(event);
  };

  const filterCommunity = community.filter((c) =>
    joinCommunity.some((jc) => jc.communityid === c.communityid)
  );

  return (
    <div className={styles.community}>
      <Header headerName={'Communities'} />
      {joinCommunity.length > 0 ? (
        <>
          <div className={styles.classification}>
            <JoinCommunity onEventSelect={handleEventSelect} communityData={community} joinCommunityData={filterCommunity} postData={post} userData={user} />
          </div>
          <JoinPostList postData={post} communityData={community} userData={user} commentData={comment} />
        </>
      ) : (
        <>
          <div className={styles.classification}>
            <Classification onEventSelect={handleEventSelect} />
          </div>
          <JoinPostList postData={post} communityData={community} userData={user} commentData={comment} />
        </>
      )}
    </div>
  );
};

export default Communities;
