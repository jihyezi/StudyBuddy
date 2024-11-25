import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Recommended.module.css";
import supabase from "components/supabaseClient";
import { useDataContext } from "api/DataContext";
import { useQuery } from "@tanstack/react-query";
import "fonts/Font.css";

// component
import HotCommunity from "components/Home/HotCommunity";
import PopularPost from "components/Home/PopularPost";

// data
const fetchHotCommunities = async () => {
  const { data, error } = await supabase
    .from("hot_communities")
    .select("communityid, member_count")
    .order("member_count", { ascending: false })
    .limit(1);

  if (error) throw new Error("Error fetching hot communities");

  const communityDetails = await Promise.all(
    data.map(async (community) => {
      const { data: communityInfo } = await supabase
        .from("Community")
        .select("*")
        .eq("communityid", community.communityid)
        .single();

      const { count: postCount } = await supabase
        .from("Post")
        .select("postid", { count: "exact" })
        .eq("communityid", community.communityid);

      return {
        ...communityInfo,
        member_count: community.member_count,
        postCount: postCount || 0,
      };
    })
  );

  return communityDetails;
};

const fetchPopularPosts = async () => {
  const { data, error } = await supabase
    .from("popular_posts")
    .select("*")
    .order("member_count", { ascending: false })
    .limit(2);

  if (error) throw new Error("Error fetching popular posts");

  const postsDetails = await Promise.all(
    data.map(async (post) => {
      const { data: postData } = await supabase
        .from("Post")
        .select("*")
        .eq("postid", post.postid)
        .single();

      const { count: likeCount } = await supabase
        .from("PostLike")
        .select("userid", { count: "exact" })
        .eq("postid", post.postid);

      const { count: commentCount } = await supabase
        .from("Comment")
        .select("userid", { count: "exact" })
        .eq("postid", post.postid);

      const { data: communityInfo } = await supabase
        .from("Community")
        .select("name")
        .eq("communityid", postData.communityid)
        .single();

      return {
        ...postData,
        likeCount,
        commentCount,
        communityName: communityInfo?.name,
      };
    })
  );

  return postsDetails;
};

const Recommended = ({ user }) => {
  const { allUserData } = useDataContext();
  const navigate = useNavigate();

  const { data: hotCommunities } = useQuery({
    queryKey: ["hotCommunities"],
    queryFn: fetchHotCommunities
  });

  const { data: popularPosts } = useQuery({
    queryKey: ["popularPosts"],
    queryFn: fetchPopularPosts
  });

  const handleCommunityClick = (community) => {
    navigate(`/detail-community/${community.communityid}`, {
      state: {
        communityData: hotCommunities,
        userData: allUserData,
      },
    });
  };

  const handlePostClick = (post) => {
    navigate(`/detail-post/${post.postid}`, {
      state: {
        communityData: hotCommunities,
        userData: [user],
        allUserData: allUserData,
        postData: post,
      },
    });
  };

  return (
    <div className={styles.recommendedContainer}>
      <div className={styles.recommendedHead}>회원님을 위한 추천👍🏻</div>
      <div className={styles.recommended}>
        <div className={styles.recommendedPosts}>
          {hotCommunities?.map((community, index) => (
            <HotCommunity
              small
              key={index}
              community={hotCommunities[0]}
              communityData={community}
              onClick={() => handleCommunityClick(community)}
            />
          ))}
          {Array.isArray(popularPosts) && popularPosts.length > 0 ? (
            popularPosts.map((post, index) => (
              <PopularPost
                small
                key={index}
                postData={post}
                postLike={post.likeCount}
                comment={post.commentCount}
                communityName={post.communityName}
                onClick={() => handlePostClick(post)}
              />
            ))
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recommended;
