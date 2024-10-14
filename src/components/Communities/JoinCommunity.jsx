import React, { useEffect, useState, useRef } from "react";
import styles from "./JoinCommunity.module.css";
import { Link, useNavigate } from "react-router-dom";
import useIsOverflow from "components/useIsOverflow";
import supabase from "components/supabaseClient";

// image
import leftArrow from "assets/icons/left_arrow.png";
import rightArrow from "assets/icons/right_arrow.png";
import noCommunityimg from 'assets/images/Communities/whitelogo.png';

const JoinCommunity = ({
  onEventSelect,
  communityData = {},
  allJoinCommunityData = {},
  joinCommunityData = {},
  postData = {},
  userData = {},
}) => {
  const [scrollState, setScrollState] = useState("start");
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const isOverflow = useIsOverflow(containerRef);

  const handleClick = (item) => {
    setSelectedItem(item);
    onEventSelect(item);
    navigate(`/detail-community/${item.communityid}`, {
      state: {
        // id: `${item.id}`,
        // img: `${item.img}`,
        // community: `${item.community}`,
        communityData: communityData,
        allJoinCommunityData: allJoinCommunityData,
        joinCommunityData: joinCommunityData,
        postData: postData,
        userData: userData,
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

  useEffect(() => {
    if (containerRef.current) {
      handleScroll(); // 데이터가 로딩된 후 스크롤 상태를 재계산
    }
  }, [joinCommunityData]);

  return (
    <div className={styles.stackTagsArea}>
      <div
        className={styles.classContainer}
        ref={containerRef}
        onScroll={handleScroll}
      >
        {joinCommunityData.map((item, index) => (
          <div
            key={index}
            className={styles.classification}
            onClick={() => handleClick(item)}
          >
            <div className={styles.joinCommunity}>
              <div className={styles.communityImageContainer}>
                {item.image ?
                  <img
                    className={styles.communityImage}
                    src={item.image}
                    alt="cat"
                  />
                  : <img
                    className={styles.communityImage}
                    src={noCommunityimg}
                    alt="cat"
                  />
                }

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
