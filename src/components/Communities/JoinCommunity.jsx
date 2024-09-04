import React, { useEffect, useState, useRef } from "react";
import styles from "./JoinCommunity.module.css";
import { Link, useNavigate } from "react-router-dom";
import useIsOverflow from "components/useIsOverflow";
import supabase from "components/supabaseClient";

// image
import cat from "assets/images/Communities/1.jpg";
import leftArrow from "../../assets/icons/left_arrow.png";
import rightArrow from "../../assets/icons/right_arrow.png";
import profile from "../../assets/icons/Communities/communityprofile.jpeg";

const JoinCommunity = ({ onEventSelect }) => {
  const [joinCommunities, setJoinCommunities] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [scrollState, setScrollState] = useState("start");
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const isOverflow = useIsOverflow(containerRef);

  const dummyData = [
    {
      id: 1,
      img: cat,
      community: "정보보안기사",
    },
    {
      id: 2,
      img: cat,
      community: "정보보안기사",
    },
    {
      id: 3,
      img: cat,
      community: "정보보안기사",
    },
    {
      id: 4,
      img: cat,
      community: "정보보안기사",
    },
    {
      id: 5,
      img: cat,
      community: "정보보안기사",
    },
    {
      id: 6,
      img: cat,
      community: "정보보안기사",
    },
    {
      id: 7,
      img: profile,
      community: "정보보안기사",
    },
    {
      id: 8,
      img: profile,
      community: "정보보안기사",
    },
    {
      id: 9,
      img: profile,
      community: "정보보안기사",
    },
    {
      id: 10,
      img: profile,
      community: "정보보안기사",
    },
  ];

  useEffect(() => {
    fetchJoinCommunityDataAll();
  }, []);

  const handleClick = (item) => {
    setSelectedItem(item);
    onEventSelect(item);
    navigate(`/detail-community/${item.communityid}`, {
      state: {
        id: `${item.id}`,
        img: `${item.img}`,
        community: `${item.community}`,
      },
    });
  };

  const handleScroll = () => {
    const { current } = containerRef;
    if (current) {
      const isAtStart = current.scrollLeft === 0;
      const isAtEnd =
        current.scrollLeft + current.clientWidth >= current.scrollWidth;
      if (isAtStart) {
        setScrollState("start");
      } else if (isAtEnd) {
        setScrollState("end");
      } else {
        setScrollState("middle");
      }
    }
  };

  const moveRight = () => {
    const { current } = containerRef;
    if (current) {
      current.scrollLeft += current.clientWidth - 20; // 각 항목의 너비만큼 스크롤
      handleScroll();
    }
  };

  const moveLeft = () => {
    const { current } = containerRef;
    if (current) {
      current.scrollLeft -= current.clientWidth - 20; // 각 항목의 너비만큼 스크롤
      handleScroll();
    }
  };

  const fetchJoinCommunityDataAll = async () => {
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
      .from("JoinCommunity")
      .select("*")
      .eq("userid", userId);

    if (error) {
      console.error("Error fetching data:", error);
    } else {
      setJoinCommunities(data);
      const communityPromises = data.map((joinCommunity) =>
        fetchCommunityDataAll(joinCommunity.communityid)
      );

      const communitiesData = await Promise.all(communityPromises);
      setCommunities(communitiesData.flat());
      console.log("communities", communitiesData[0]);
    }
  };

  const fetchCommunityDataAll = async (communityId) => {
    const { data, error } = await supabase
      .from("Community")
      .select("*")
      .eq("communityid", communityId);

    if (error) {
      console.error("Error fetching data:", error);
      return [];
    } else {
      return data;
    }
  };

  return (
    <div className={styles.stackTagsArea}>
      <div
        className={styles.classContainer}
        ref={containerRef}
        onScroll={handleScroll}
      >
        {communities.map((item, index) => (
          <div
            key={index}
            className={styles.classification}
            onClick={() => handleClick(item)}
          >
            <div className={styles.joinCommunity}>
              <div className={styles.communityImageContainer}>
                <img
                  className={styles.communityImage}
                  src={item.image}
                  alt="cat"
                />
              </div>
              <div className={styles.communityName}>{item.name}</div>
            </div>
          </div>
        ))}
      </div>
      {isOverflow && (scrollState === "middle" || scrollState === "end") && (
        <div className={`${styles.overflowBox} ${styles.overflowBoxLeft}`}>
          <button className={styles.scrollButton} onClick={moveLeft}>
            <img
              src={leftArrow}
              style={{ width: 30, height: 30 }}
              alt="Left Arrow"
            />
          </button>
        </div>
      )}
      {isOverflow && (scrollState === "middle" || scrollState === "start") && (
        <div className={`${styles.overflowBox} ${styles.overflowBoxRight}`}>
          <button className={styles.scrollButton} onClick={moveRight}>
            <img
              src={rightArrow}
              style={{ width: 30, height: 30 }}
              alt="Right Arrow"
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default JoinCommunity;
