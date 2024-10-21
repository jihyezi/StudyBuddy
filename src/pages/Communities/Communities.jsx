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
import loadinggif from "assets/images/loading.gif"

const Communities = () => {
  const [selectedEvent, setSelectEvent] = useState("");
  const [user, setUser] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [community, setCommunity] = useState([]);
  const [allJoinCommunity, setAllJoinCommunity] = useState([]);
  const [joinCommunity, setJoinCommunity] = useState([]);
  const [post, setPost] = useState([]);
  const [comment, setComment] = useState([]);
  const [fieldCommunity, setFieldCommunity] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: sessionUser } = useAuth();

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
      } else {
        setUser([]);
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
      const { data, error } = await supabase.from("Community").select("*");

      if (error) {
        console.error("Error", error);
      } else {
        setCommunity(data);
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
      } else {
        setAllJoinCommunity([]);
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
      } else {
        setJoinCommunity([]);
      }
    };

    const fetchPostData = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("Post").select("*");

      if (error) {
        console.error("Error", error);
      } else {
        setPost(data);
      }
      setLoading(false);
    };

    const fetchCommentData = async () => {
      if (post.postid) {
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


    const fetchfieldData = async () => {
      if (selectedEvent) {  // selectedEvent가 비어 있지 않은지 확인
        const { data, error } = await supabase
          .from('Community')
          .select('*')
          .eq('field', selectedEvent);

        if (error) {
          console.error("Error", error);
        } else {
          console.log('data', data);
          setFieldCommunity(data);
        }
      }
    };

    // sessionUser가 없을 경우에도 기본 데이터를 로드
    fetchCommunityData();
    fetchAllUserData();
    fetchPostData();
    fetchCommentData();
    fetchfieldData();

    if (sessionUser) {
      fetchUserData();
      fetchJoinCommunityData();
      fetchAllJoinCommunityData();
    }

  }, [sessionUser]);

  const handleEventSelect = (event) => {
    setSelectEvent(event);
  };

  console.log('comm-select', selectedEvent)

  const filterCommunity = community.filter((c) =>
    joinCommunity.some((jc) => jc.communityid === c.communityid)
  );

  const filteredPosts = post.filter((p) =>
    filterCommunity.some(
      (fc) => Number(fc.communityid) === Number(p.communityid)
    )
  );

  const filteredCommunities = selectedEvent === "🔥"
    ? community
    : community.filter(c => c.field === selectedEvent);

  const filterfieldPosts = selectedEvent === "🔥"
    ? post
    : post.filter(p =>
      filteredCommunities.some(fc => Number(fc.communityid) === Number(p.communityid))
    );

  return (
    <div className={styles.community}>
      <Header headerName={"Communities"} />
      {loading ? (
        <div style={{ display: 'flex', width: '100%', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
          <img src={loadinggif} style={{ width: '80px' }} alt="Loading" />
        </div>
      ) : (
        joinCommunity.length > 0 ? (
          <>
            <div className={styles.classification1}>
              <JoinCommunity
                onEventSelect={handleEventSelect}
                communityData={community}
                allJoinCommunityData={allJoinCommunity}
                joinCommunityData={filterCommunity}
                postData={post}
                userData={user}
                allUserData={allUser}
              />
            </div>
            <JoinPostList
              postData={filteredPosts}
              communityData={community}
              userData={user}
              allUserData={allUser}
              commentData={comment}
            />
          </>
        ) : (
          <>
            <div className={styles.classification2}>
              <Classification
                onEventSelect={handleEventSelect}
              />
            </div>
            {filterfieldPosts.length > 0 ?
              <JoinPostList
                postData={filterfieldPosts}
                communityData={community}
                userData={user}
                allUserData={allUser}
                commentData={comment}
              /> :
              <div className={styles.nopostcontainer}>
                <div className={styles.nopost}>No Posts Yet</div>
              </div>
            }

          </>
        )
      )}

    </div>
  );
};

export default Communities;