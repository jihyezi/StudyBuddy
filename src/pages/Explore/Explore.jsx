import React, { useState, useEffect } from "react";
import styles from "./Explore.module.css";
import HotCommunity from "components/Home/HotCommunity";
import StudyPost from "components/Explore/ExploreStudyPost";
import supabase from "components/supabaseClient";
import Tag from "components/Explore/Explore_Tag";
import { useAuth } from "contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import loadinggif from "assets/images/loading.gif";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// 핫 커뮤니티 데이터를 가져오는 함수
const fetchHotCommunities = async () => {
  const { data, error } = await supabase
    .from("hot_communities")
    .select("*")
    .order("member_count", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Error fetching hot communities:", error);
    throw new Error("Error fetching hot communities");
  }

  const communityData = await Promise.all(
    data.map(async (community) => {
      const { data: communityInfo, error: communityError } = await supabase
        .from("Community")
        .select("*")
        .eq("communityid", community.communityid)
        .single();

      if (communityError) {
        console.error(
          `Error fetching community data for community ID ${community.communityid}:`,
          communityError
        );
        return null;
      }

      const { count: postCount, error: postCountError } = await supabase
        .from("Post")
        .select("postid", { count: "exact" })
        .eq("communityid", community.communityid);

      if (postCountError) {
        console.error(
          `Error fetching post count for community ID ${community.communityid}:`,
          postCountError
        );
        return { ...communityInfo, postCount: 0 };
      }

      const combinedData = {
        ...communityInfo,
        postCount: postCount || 0,
        member_count: community.member_count, // 여기에 member_count를 추가
      };

      return combinedData;
    })
  );

  return communityData.filter((community) => community !== null);
};

// 인기 스터디 데이터를 가져오는 함수
const fetchPopularStudies = async () => {
  const { data: studies, error } = await supabase.from("Study").select("*");
  if (error) throw new Error("Error fetching studies");

  const studiesWithLikes = await Promise.all(
    studies.map(async (study) => {
      const { count: likesCount } = await supabase
        .from("StudyLike")
        .select("studyid", { count: "exact" })
        .eq("studyid", study.studyid);

      return { ...study, likesCount: likesCount || 0 };
    })
  );

  return studiesWithLikes
    .sort((a, b) => b.likesCount - a.likesCount)
    .slice(0, 2);
};

// HotCommunity 컴포넌트를 React.memo로 감싸서 메모이제이션 처리
const MemoizedHotCommunity = React.memo(HotCommunity);

// StudyPost 컴포넌트를 React.memo로 감싸서 메모이제이션 처리
const MemoizedStudyPost = React.memo(StudyPost);

const Explore = () => {
  const { user: sessionUser } = useAuth();
  const [user, setUser] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 핫 커뮤니티 데이터
  const {
    data: hotCommunities,
    error: hotCommunitiesError,
    isLoading: isLoadingHotCommunities,
  } = useQuery({
    queryKey: ["hotCommunities"],
    queryFn: fetchHotCommunities,
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
    refetchOnWindowFocus: false,
  });

  // 인기 스터디 데이터
  const {
    data: popularStudies,
    error: popularStudiesError,
    isLoading: isLoadingPopularStudies,
  } = useQuery({
    queryKey: ["popularStudies"],
    queryFn: fetchPopularStudies,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (sessionUser) {
      const fetchUserData = async () => {
        const { data, error } = await supabase
          .from("User")
          .select("*")
          .eq("userid", sessionUser.id);

        if (error) console.error("Error fetching user data:", error);
        else setUser(data);
      };

      const fetchAllUserData = async () => {
        const { data, error } = await supabase.from("User").select("*");

        if (error) console.error("Error fetching all users:", error);
        else setAllUser(data);
      };

      fetchUserData();
      fetchAllUserData();
    }
  }, [sessionUser]);

  const handleCommunityClick = (community) => {
    navigate(`/detail-community/${community.communityid}`, {
      state: {
        communityData: hotCommunities, // hotCommunities 데이터를 전달
        userData: user,
      },
    });
  };

  useEffect(() => {
    return () => {
      queryClient.invalidateQueries(["hotCommunities"]);
      queryClient.invalidateQueries(["popularStudies"]);
    };
  }, [queryClient]);

  // 모든 데이터가 로딩되었는지 확인
  const isLoading = isLoadingHotCommunities || isLoadingPopularStudies;

  if (isLoading) {
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
        <img src={loadinggif} style={{ width: "80px" }} alt="Loading" />
      </div>
    );
  }

  if (hotCommunitiesError || popularStudiesError) {
    return (
      <div>
        Error loading data:{" "}
        {hotCommunitiesError?.message || popularStudiesError?.message}
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className={styles.Explore}>
      {/* 인기 태그 검색 */}
      <div className={styles.PopularTagContainer}>
        <div style={{ position: "relative" }}>
          <div className={styles.CategoryText}>인기 태그 검색🏷️</div>
          <div className={styles.CategoryTag}>
            <Tag />
          </div>
        </div>
      </div>

      {/* 핫 커뮤니티 */}
      <div className={styles.HotCommunitiesContainer}>
        <div style={{ position: "relative" }}>
          <div className={styles.CategoryText}>🔥 HOT 커뮤니티 </div>
          <div className={styles.HotCommunity}>
            <div className={styles.HotCommunityContainer}>
              {hotCommunities && hotCommunities.length > 0 ? (
                hotCommunities.map((community, index) => (
                  <MemoizedHotCommunity
                    key={community.communityid}
                    community={community}
                    communityData={hotCommunities[index]}
                    onClick={() => handleCommunityClick(community)}
                  />
                ))
              ) : (
                <div>No hot communities available.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 인기 스터디 */}
      <div className={styles.PopularStudyContainer}>
        <div style={{ position: "relative", width: "1080px" }}>
          <div className={styles.CategoryText}>⭐️ 인기 스터디</div>
          <div className={styles.StudyPostContainer}>
            {popularStudies && popularStudies.length > 0 ? (
              popularStudies.map((post) => (
                <MemoizedStudyPost
                  key={post.studyid}
                  studyId={post.studyid}
                  completion={post.completion}
                  title={post.title}
                  description={post.description.split("\n")[0]}
                  tag={post.tag}
                  studyPost={post}
                  user={user}
                  allUser={allUser}
                />
              ))
            ) : (
              <div>No popular studies available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
