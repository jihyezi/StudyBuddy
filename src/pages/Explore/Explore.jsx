import React, { useState, useEffect } from "react";
import styles from "./Explore.module.css";
import HotCommunity from "components/Home/HotCommunity";
import StudyPost from "components/Explore/ExploreStudyPost";
import supabase from "components/supabaseClient";
import Tag from "components/Home/Tag";

import { useAuth } from "contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Explore = () => {
  const [hotCommunities, setHotCommunities] = useState([]);
  const [communityData, setCommunityData] = useState({});
  // const [popularStudies, setPopularStudies] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]); // 선택한 태그 상태
  const { user: sessionUser } = useAuth();
  const [user, setUser] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [communityy, setCommunityy] = useState([]);
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

  useEffect(() => {
    fetchHotCommunities();

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

  const postProps = {
    state: "1",
    title: "정보처리기사 온라인 스터디 ",
    content:
      "정보처리기사 온라인 스터디 모집합니다! 디코에서 주 3회 스터디 진행할 예정입니다!!",
    tag: ["정보처리기사", "온라인 스터디", "자격증"],
    person: 5,
    type: "온라인",
  };

  return (
    <div className={styles.Explore}>
      <div className={styles.PopularTagContainer}>
        <div style={{ position: "relative" }}>
          <div className={styles.CategoryText}>인기 태그 🏷️</div>
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
            <StudyPost {...postProps} />
            <StudyPost {...postProps} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
