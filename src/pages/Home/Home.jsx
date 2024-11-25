import React, { useEffect, useState } from "react";
import styles from "./Home.module.css";
import supabase from "components/supabaseClient";
import { useAuth } from "contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
// sclick
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// component
import HotCommunity from "components/Home/HotCommunity";
import PopularPost from "components/Home/PopularPost";
import PopularStudy from "components/Home/PopularStudy";

import LoginModal from "components/Home/LoginModal";

import onboarding1 from "assets/images/Onboarding/onboarding1.png";
import onboarding2 from "assets/images/Onboarding/onboarding2.png";
import onboarding3 from "assets/images/Onboarding/onboarding3.png";
import onboarding4 from "assets/images/Onboarding/onboarding4.png";

import Tag from "components/Home/Tag";

const Home = ({}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [popularPosts, setPopularPosts] = useState([]);
  const [postData, setPostData] = useState([]);
  const [postLike, setPostLike] = useState([]);
  const [comment, setComment] = useState([]);
  const [communityName, setCommunityName] = useState("");
  const [selectedTag, setSelectedTag] = useState("🔥");
  const [selectedEvent, setSelectEvent] = useState("");
  const [popularStudies, setPopularStudies] = useState([]);

  const { user: sessionUser } = useAuth();
  const [user, setUser] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [communityy, setCommunityy] = useState([]);
  const navigate = useNavigate();

  const fetchPopularStudies = async (tag) => {
    if (tag === "🔥") {
      const { data, error } = await supabase
        .from("all_popular_studies")
        .select("studyid, like_count")
        .limit(3);

      if (error) {
        console.error("Error fetching popular studies:", error);
      } else {
        const studyIds = data.map((item) => item.studyid);
        const { data: studies, error: studyError } = await supabase
          .from("Study")
          .select("*")
          .in("studyid", studyIds);

        if (studyError) {
          console.error("Error fetching study details:", studyError);
        } else {
          setPopularStudies(studies);
        }
      }
    } else {
      const { data, error } = await supabase
        .from("popular_studiess")
        .select("*")
        .contains("tag", JSON.stringify([tag]))
        .limit(3);

      if (error) {
        console.error("Error fetching popular studies:", error);
      } else {
        setPopularStudies(data);
      }
    }
  };

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

    console.log("Fetched Hot Communities", data);

    // 병렬 처리
    const fetchedCommunityData = await Promise.all(
      data.map(async (community) => {
        const communityInfoPromise = supabase
          .from("Community")
          .select("*")
          .eq("communityid", community.communityid)
          .single();

        const postCountPromise = supabase
          .from("Post")
          .select("postid", { count: "exact" })
          .eq("communityid", community.communityid);

        const [communityInfo, postCount] = await Promise.all([
          communityInfoPromise,
          postCountPromise,
        ]);

        if (communityInfo.error || postCount.error) {
          console.error(
            "Error fetching community data:",
            communityInfo.error || postCount.error
          );
          return null;
        }

        return {
          ...community, // member_count 포함
          postCount: postCount.count, // postCount 추가
          name: communityInfo.data.name, // name 추가
          createdat: communityInfo.data.createdat, // createdat 추가
          field: communityInfo.data.field, // field 추가
        };
      })
    );

    return fetchedCommunityData.filter(Boolean); // null 제거
  };

  const {
    data: hotCommunities = [],
    isLoading: isLoadingCommunities,
    error,
  } = useQuery({
    queryKey: ["hotCommunities"],
    queryFn: fetchHotCommunities,
    staleTime: 5 * 60 * 1000, // 5분 동안 캐싱
    cacheTime: 10 * 60 * 1000, // 10분 동안 캐시 유지
    refetchOnWindowFocus: false,
  });

  const fetchPopularPosts = async () => {
    const { data: popularPostsData, error: popularPostsError } = await supabase
      .from("popular_posts")
      .select("*")
      .order("member_count", { ascending: false })
      .limit(3);

    if (popularPostsError) {
      console.error("Error fetching popular posts:", popularPostsError);
      throw new Error("Error fetching popular posts");
    }

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

    return {
      popularPostsData,
      validPostData,
      validPostLikeCounts,
      validCommentCounts,
      validCommunityName,
    };
  };

  const usePopularPosts = () => {
    return useQuery({
      queryKey: ["popularPosts"],
      queryFn: fetchPopularPosts,
      staleTime: 5 * 60 * 1000, // 5분 동안 캐싱
      cacheTime: 10 * 60 * 1000, // 10분 동안 캐시 유지
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error("Error fetching popular posts:", error);
      },
    });
  };

  const { data = { popularPostsData: [] } } = usePopularPosts();

  // React Query 데이터를 상태에 설정
  useEffect(() => {
    if (data && Array.isArray(data.popularPostsData)) {
      if (
        JSON.stringify(data.popularPostsData) !== JSON.stringify(popularPosts)
      ) {
        setPopularPosts(data.popularPostsData);
      }
      if (JSON.stringify(data.validPostData) !== JSON.stringify(postData)) {
        setPostData(data.validPostData);
      }
      if (
        JSON.stringify(data.validPostLikeCounts) !== JSON.stringify(postLike)
      ) {
        setPostLike(data.validPostLikeCounts);
      }
      if (JSON.stringify(data.validCommentCounts) !== JSON.stringify(comment)) {
        setComment(data.validCommentCounts);
      }
      if (
        JSON.stringify(data.validCommunityName) !==
        JSON.stringify(communityName)
      ) {
        setCommunityName(data.validCommunityName);
      }
    }
  }, [data, popularPosts, postData, postLike, comment, communityName]);
  useEffect(() => {
    // fetchHotCommunities();
    // fetchPopularPosts();

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
          setCommunityy(data);
        }
      }
    };

    fetchUserData();
    fetchAllUserData();
    fetchCommunityData();
  }, []);

  useEffect(() => {
    const fetchInitialPopularStudies = async () => {
      if (!popularStudies.length) {
        await fetchPopularStudies(selectedTag);
      }
    };

    fetchInitialPopularStudies();
  }, [selectedTag, popularStudies]);
  const handleEventSelect = async (event, tag) => {
    setSelectEvent(event);
    setSelectedTag(tag);
    await fetchPopularStudies(tag);
  };

  const handleCommuntiyClick = (community) => {
    navigate(`/detail-community/${community.communityid}`, {
      state: {
        communityData: communityy,
        userData: user[0],
      },
    });
  };

  const handlePostClick = (post) => {
    navigate(`/detail-post/${post.postid}`, {
      state: {
        communityData: communityy,
        userData: user,
        allUserData: allUser,
        postData: postData[0],
      },
    });
  };

  const handleStudyClick = (study) => {
    navigate(`/detail-study/${study.studyid}`, {
      state: {
        communityData: communityy,
        userDataa: user,
        postData: postData[0],
        studyData: study,
      },
    });
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (current) => setCurrentSlide(current),
    appendDots: (dots) => (
      <div
        style={{
          display: "flex",
          position: "absolute",
          width: "80px",
          height: "32px",
          bottom: "-14px",
          left: "7%",
          borderRadius: "8px",
          opacity: "0px",
          backgroundColor: "#FFF",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ul
          style={{
            display: "flex",
            padding: 0,
            margin: 0,
            gap: "3px",
            alignItems: "center",
            justifyContent: "center",
            listStyleType: "none", // 기본 리스트 스타일 제거
          }}
        >
          {dots.map((dot, index) => (
            <li
              key={index}
              style={{
                display: "flex",
                margin: "0 3px",
                width: "6px",
                height: "6px",
                justifyContent: "center",
              }}
            >
              {dot}
            </li>
          ))}
        </ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        style={{
          width: "6px",
          height: "6px",
          backgroundColor: i === currentSlide ? "#FF7474" : "#9c9c9c",
          // border: i === currentSlide ? "4px solid #fcc6c6" : "none",
          borderRadius: "50%",
        }}
      />
    ),
  };

  return (
    <div className={styles.home}>
      <Slider {...settings} style={{ display: "grid" }}>
        <div style={{ height: "100%", width: "100%" }}>
          <img
            src={onboarding1}
            alt="Slide 1"
            style={{ height: "260px", width: "100%", objectFit: "cover" }}
          />
        </div>
        <div style={{ height: "100%", width: "100%" }}>
          <img
            src={onboarding2}
            alt="Slide 2"
            style={{ height: "260px", width: "100%", objectFit: "cover" }}
          />
        </div>
        <div style={{ height: "100%", width: "100%" }}>
          <img
            src={onboarding3}
            alt="Slide 3"
            style={{ height: "260px", width: "100%", objectFit: "cover" }}
          />
        </div>
        <div style={{ height: "100%", width: "100%" }}>
          <img
            src={onboarding4}
            alt="Slide 4"
            style={{ height: "260px", width: "100%", objectFit: "cover" }}
          />
        </div>
      </Slider>
      <div
        style={{
          display: "flex",
          padding: "70px 0px 30px 0px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "relative",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: 20,
              position: "relative",
              marginBottom: 28,
              fontFamily: "Manrope-Bold",
            }}
          >
            🔥 HOT 커뮤니티
          </div>
          <div
            className={styles.scrollContainer}
            style={{
              position: "relative",
            }}
          >
            <div className={styles.hotCommunityItem}>
              {hotCommunities.map((community, index) => (
                <HotCommunity
                  key={index}
                  community={community}
                  communityData={community}
                  allcommunity={communityy}
                  onClick={() => handleCommuntiyClick(community)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          padding: "30px 0px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "relative",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: 20,
              position: "relative",
              marginBottom: 28,
              fontFamily: "Manrope-Bold",
            }}
          >
            ⭐️ 인기글
          </div>
          <div
            className={styles.scrollContainer}
            style={{
              position: "relative",
              width: "100%",
            }}
          >
            <div className={styles.hotCommunityItem}>
              {popularPosts.map((post, index) => (
                <PopularPost
                  key={post.postid}
                  postData={postData[index]} // Post 데이터 전달
                  postLike={postLike[index]} // 좋아요 수 전달
                  comment={comment[index]} // 댓글 수 전달
                  communityName={communityName[index] || "커뮤니티"} // 커뮤니티 이름 전달
                  onClick={() => handlePostClick(post)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/*  react slick 캐러셀  만들기*/}
      <div
        style={{
          display: "flex",
          padding: "30px 0px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "relative",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: 20,
              position: "relative",
              marginBottom: 28,
              fontFamily: "Manrope-Bold",
            }}
          >
            태그별 인기 스터디 🤗
          </div>

          <div
            style={{
              position: "relative",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Tag onEventSelect={handleEventSelect} />
            <div className={styles.popularStudy}>
              {popularStudies.map((study) => (
                <PopularStudy
                  key={study.id}
                  study={study}
                  onClick={() => handleStudyClick(study)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <LoginModal />
    </div>
  );
};

export default Home;
