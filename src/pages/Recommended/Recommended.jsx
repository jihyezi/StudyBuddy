import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Recommended.module.css";
import supabase from "components/supabaseClient";
import "fonts/Font.css";

// component
import HotCommunity from "components/Home/HotCommunity";
import PopularPost from "components/Home/PopularPost";

const Recommended = ({ user }) => {
  const [hotCommunities, setHotCommunities] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [communityName, setCommunityName] = useState([]);
  const [communityData, setCommunityData] = useState({});
  const [postData, setPostData] = useState([]);
  const [postLike, setPostLike] = useState(null);
  const [comment, setComment] = useState(null);
  const [allUser, setAllUser] = useState([]);

  const navigate = useNavigate();

  const fetchHotCommunities = async () => {
    const { data, error } = await supabase
      .from("hot_communities")
      .select("*")
      .order("member_count", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Error fetching hot communities:", error);
    } else {
      setHotCommunities(data);
      const fetchedCommunityData = await Promise.all(
        data.map(async (community) => {
          const { data: communityInfo, error: communityError } = await supabase
            .from("Community")
            .select("*")
            .eq("communityid", community.communityid)
            .single();

          if (communityError) {
            console.error("Error fetching community data:", communityError);
            return null;
          }

          const { count: postCount, error: postCountError } = await supabase
            .from("Post")
            .select("postid", { count: "exact" })
            .eq("communityid", community.communityid);

          if (postCountError) {
            console.error("Error fetching post count:", postCountError);
            return null;
          }

          return { communityInfo, postCount };
        })
      );

      const combinedData = fetchedCommunityData.filter(Boolean).map((data) => ({
        ...data.communityInfo,
        postCount: data.postCount,
      }));

      setCommunityData(combinedData);
    }
  };

  const fetchPopularPosts = async () => {
    const { data: popularPostsData, error: popularPostsError } = await supabase
      .from("popular_posts")
      .select("*")
      .order("member_count", { ascending: false })
      .limit(2);

    if (popularPostsError) {
      console.error("Error fetching popular posts:", popularPostsError);
    } else {
      setPopularPosts(popularPostsData);

      const fetchedPostData = await Promise.all(
        popularPostsData.map(async (post) => {
          const { data: postData, error: postError } = await supabase
            .from("Post")
            .select("*")
            .eq("postid", post.postid)
            .single();

          if (postError) {
            console.error("Error fetching post data:", postError);
            return null;
          }
          return postData;
        })
      );
      const validPostData = fetchedPostData.filter(Boolean);
      setPostData(validPostData);

      const fetchedPostLikeCounts = await Promise.all(
        popularPostsData.map(async (post) => {
          const { count, error: likeError } = await supabase
            .from("PostLike")
            .select("userid", { count: "exact" })
            .eq("postid", post.postid);

          if (likeError) {
            console.error("Error fetching post like count:", likeError);
            return null;
          }
          return count;
        })
      );
      const validPostLikeCounts = fetchedPostLikeCounts.filter(Boolean);
      setPostLike(validPostLikeCounts);

      const fetchedCommentCounts = await Promise.all(
        popularPostsData.map(async (post) => {
          const { count, error: commentError } = await supabase
            .from("Comment")
            .select("userid", { count: "exact" })
            .eq("postid", post.postid);

          if (commentError) {
            console.error("Error fetching comment count:", commentError);
            return null;
          }
          return count;
        })
      );
      const validCommentCounts = fetchedCommentCounts.filter(Boolean);
      setComment(validCommentCounts);

      const fetchedCommunityName = await Promise.all(
        popularPostsData.map(async (post) => {
          const { data: postData, error: postError } = await supabase
            .from("Post")
            .select("communityid")
            .eq("postid", post.postid)
            .single();

          if (postError) {
            console.error("Error fetching post data:", postError);
            return null;
          }

          const communityId = postData.communityid;

          const { data: communityData, error: nameError } = await supabase
            .from("Community")
            .select("name")
            .eq("communityid", communityId)
            .single();

          if (nameError) {
            console.error("Error fetching community name:", nameError);
            return null;
          }

          return communityData.name;
        })
      );
      const validCommunityName = fetchedCommunityName.filter(Boolean);
      setCommunityName(validCommunityName);
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

  useEffect(() => {
    fetchHotCommunities();
    fetchPopularPosts();
    fetchAllUserData();
  }, []);

  const handleCommuntiyClick = (community) => {
    navigate(`/detail-community/${community.communityid}`, {
      state: {
        // id: `${item.id}`,
        // img: `${item.img}`,
        // community: `${item.community}`,
        communityData: communityData,
        // allJoinCommunityData: allJoinCommunityData,
        // joinCommunityData: joinCommunityData,
        // postData: postData,
        userData: allUser,
      },
    });
  };

  const handlePostClick = (post) => {
    navigate(`/detail-post/${post.postid}`, {
      state: {
        communityData: communityData,
        userData: [user],
        allUserData: allUser,
        postData: postData[0],
      },
    });
  };

  return (
    <div className={styles.recommendedContainer}>
      <div className={styles.recommendedHead}>회원님을 위한 추천👍🏻</div>
      <div className={styles.recommended}>
        <div className={styles.recommendedPosts}>
          {hotCommunities.map((community, index) => (
            <HotCommunity
              small
              community={community}
              communityData={communityData[index]}
              onClick={() => handleCommuntiyClick(community)}
            />
          ))}
          {popularPosts.map((post, index) => (
            <PopularPost
              small
              postData={postData[index]}
              postLike={postLike}
              comment={comment}
              communityName={communityName[index]}
              onClick={() => handlePostClick(post)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recommended;
