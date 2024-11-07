import React, { useState, useEffect } from "react";
import styles from "./Explore.module.css";
import HotCommunity from "components/Home/HotCommunity";
import StudyPost from "components/Explore/ExploreStudyPost";
import supabase from "components/supabaseClient";
import Tag from "components/Explore/Explore_Tag";
import { useAuth } from "contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Explore = () => {
  const [hotCommunities, setHotCommunities] = useState([]);
  const [communityData, setCommunityData] = useState([]);
  const { user: sessionUser } = useAuth();
  const [user, setUser] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [communityy, setCommunityy] = useState([]);
  const [popularStudies, setPopularStudies] = useState([]);
  const navigate = useNavigate();

  const fetchHotCommunities = async () => {
    const { data, error } = await supabase
      .from("hot_communities")
      .select("*")
      .order("member_count", { ascending: false })
      .limit(3);

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

  const fetchPopularStudies = async () => {
    const { data: studies, error: studiesError } = await supabase
      .from("Study")
      .select("*");

    if (studiesError) {
      console.error("Error fetching studies:", studiesError);
      return;
    }

    const studiesWithLikes = await Promise.all(
      studies.map(async (study) => {
        const { count: likesCount, error: likesError } = await supabase
          .from("StudyLike")
          .select("studyid", { count: "exact" })
          .eq("studyid", study.studyid);

        if (likesError) {
          console.error("Error fetching likes count:", likesError);
          return null;
        }

        const totalLikes = likesCount || 0;

        return { ...study, likesCount: totalLikes };
      })
    );

    const validStudies = studiesWithLikes.filter(Boolean);
    const topStudies = validStudies
      .sort((a, b) => b.likesCount - a.likesCount)
      .slice(0, 2);

    setPopularStudies(topStudies);
  };

  useEffect(() => {
    fetchHotCommunities();
    fetchPopularStudies();

    const fetchUserData = async () => {
      if (sessionUser) {
        const { data, error } = await supabase
          .from("User")
          .select("*")
          .eq("userid", sessionUser.id);

        if (error) {
          console.error("Error fetching user data:", error);
        } else {
          setUser(data);
        }
      }
    };

    const fetchAllUserData = async () => {
      const { data, error } = await supabase.from("User").select("*");

      if (error) {
        console.error("Error fetching all users:", error);
      } else {
        setAllUser(data);
      }
    };

    const fetchCommunityData = async () => {
      const { data, error } = await supabase.from("Community").select("*");

      if (error) {
        console.error("Error fetching communities:", error);
      } else {
        setCommunityy(data);
      }
    };

    fetchUserData();
    fetchAllUserData();
    fetchCommunityData();
  }, [sessionUser]);

  const handleCommunityClick = (community) => {
    navigate(`/detail-community/${community.communityid}`, {
      state: {
        communityData: communityy,
        userData: user,
      },
    });
  };

  return (
    <div className={styles.Explore}>
      <div className={styles.PopularTagContainer}>
        <div style={{ position: "relative" }}>
          <div className={styles.CategoryText}>인기 태그 검색🏷️</div>
          <div className={styles.CategoryTag}>
            <Tag />
          </div>
        </div>
      </div>
      <div className={styles.HotCommunitiesContainer}>
        <div style={{ position: "relative" }}>
          <div className={styles.CategoryText}>🔥 HOT 커뮤니티 </div>
          <div className={styles.HotCommunity}>
            <div className={styles.HotCommunityContainer}>
              {hotCommunities.map((community, index) => (
                <HotCommunity
                  key={index}
                  community={community}
                  communityData={communityData[index]}
                  onClick={() => handleCommunityClick(community)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.PopularStudyContainer}>
        <div style={{ position: "relative", width: "1080px" }}>
          <div className={styles.CategoryText}>⭐️ 인기 스터디</div>
          <div className={styles.StudyPostContainer}>
            {popularStudies.map((post, index) => (
              <StudyPost
                key={index}
                studyId={post.studyid}
                completion={post.completion}
                title={post.title}
                description={post.description.split("\n")[0]}
                tag={post.tag}
                studyPost={post}
                user={user}
                allUser={allUser}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
