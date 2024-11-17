import React, { useEffect, useState } from "react";
import styles from "./Home.module.css";
import supabase from "components/supabaseClient";
import { useAuth } from "contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// sclick
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// component
import HotCommunity from "components/Home/HotCommunity";
import PopularPost from "components/Home/PopularPost";
import RecentCommunity from "components/Home/RecentCommunity";
import PopularStudy from "components/Home/PopularStudy";
import HomeImage from "assets/images/Home/OnBoardingImage1.png";
import leftarrow from "assets/icons/Home/leftarrow.png";
import rightarrow from "assets/icons/Home/rightarrow.png";
import downarrow from "assets/icons/Home/downarrow.png";

import LoginModal from "components/Home/LoginModal";

import onboarding1 from "assets/images/Onboarding/onboarding1.png";
import onboarding2 from "assets/images/Onboarding/onboarding2.png";
import onboarding3 from "assets/images/Onboarding/onboarding3.png";
import onboarding4 from "assets/images/Onboarding/onboarding4.png";

import onboardingimg from "assets/images/Home/OnBoarding.png";
import Classification from "components/Communities/Classification";
import Tag from "components/Home/Tag";

const Home = ({ }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hotCommunities, setHotCommunities] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [communityData, setCommunityData] = useState({});
  const [postData, setPostData] = useState([]);
  const [postLike, setPostLike] = useState(null);
  const [comment, setComment] = useState(null);
  const [communityName, setCommunityName] = useState(null);
  const [selectedTag, setSelectedTag] = useState("🔥");
  const [selectedEvent, setSelectEvent] = useState("");
  const [popularStudies, setPopularStudies] = useState([]);

  const { user: sessionUser } = useAuth();
  const [user, setUser] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [communityy, setCommunityy] = useState([]);
  const navigate = useNavigate();

  console.log('communityy', communityy)
  console.log('communityData', communityData)


  useEffect(() => {
    const fetchInitialPopularStudies = async () => {
      await fetchPopularStudies(selectedTag);
    };
    fetchInitialPopularStudies();
  }, []);

  const handleEventSelect = async (event, tag) => {
    setSelectEvent(event);
    setSelectedTag(tag);
    await fetchPopularStudies(tag);
  };

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
      .limit(3);

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

  useEffect(() => {
    fetchHotCommunities();
    fetchPopularPosts();

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

  console.log(communityy);
  console.log(user[0])

  const handleCommuntiyClick = (community) => {
    navigate(`/detail-community/${community.communityid}`, {
      state: {
        // id: `${item.id}`,
        // img: `${item.img}`,
        // community: `${item.community}`,
        communityData: communityy,
        // allJoinCommunityData: allJoinCommunityData,
        // joinCommunityData: joinCommunityData,
        // postData: postData,
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
                  community={community}
                  communityData={communityData[index]}
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
                  postData={postData[index]}
                  postLike={postLike}
                  comment={comment}
                  communityName={
                    communityName ? communityName[index] : "커뮤니티"
                  }
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
            {/* <div
              style={{
                display: "flex",
                flexDirection: "row",
                maxWidth: 1020,
                alignItems: "center",
                justifyContent: "space-between", // Space out the elements
              }}
            >
              <img src={leftarrow} />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "20px", // 버튼 간의 간격 설정
                  alignItems: "center",
                  flexGrow: 1,
                }}
              >
                <button
                  style={{
                    padding: "4px 7px",
                    borderRadius: 8,
                    backgroundColor: "#FF74741F",
                    fontWeight: 400,
                    fontSize: 20,
                    color: "#FF7474",
                    border: "1px solid #FFF",
                    width: 122,
                    height: 43,
                  }}
                >
                  Technology
                </button>
                <button
                  style={{
                    padding: "4px 7px",
                    borderRadius: 8,
                    backgroundColor: "#0000",
                    fontWeight: 400,
                    fontSize: 20,
                    color: "#9c9c9c",
                    border: "1px solid #DDD",
                    width: 76,
                    height: 43,
                  }}
                >
                  Sports
                </button>
                <button
                  style={{
                    padding: "4px 7px",
                    borderRadius: 8,
                    backgroundColor: "#0000",
                    fontWeight: 400,
                    fontSize: 20,
                    color: "#9c9c9c",
                    border: "1px solid #DDD",
                    width: 42,
                    height: 43,
                  }}
                >
                  Art
                </button>
                <button
                  style={{
                    padding: "4px 7px",
                    borderRadius: 8,
                    backgroundColor: "#0000",
                    fontWeight: 400,
                    fontSize: 20,
                    color: "#9c9c9c",
                    border: "1px solid #DDD",
                    width: 148,
                    height: 43,
                  }}
                >
                  Entertainment
                </button>
              </div>
              <img src={rightarrow} />
            </div>
            <div className={styles.hotCommunityItem}>
              <PopularStudy />
            </div>
            <div
              style={{
                marginTop: 40,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <button
                style={{
                  width: 134,
                  height: 43,
                  borderRadius: 12,
                  backgroundColor: "#FFF",
                  padding: "10px 20px",
                  border: "1px solid #9c9c9c",
                  fontWeight: 600,
                  fontSize: 20,
                  color: "#9c9c9c",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                more <img src={downarrow} />
              </button>
            </div> */}
          </div>
        </div>
      </div>
      <LoginModal />
    </div>
  );
};

export default Home;
