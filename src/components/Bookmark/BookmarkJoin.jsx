import React, { useEffect, useState, useRef } from "react";
import styles from "./BookmarkJoin.module.css";
import { useNavigate } from "react-router-dom";
import useIsOverflow from "components/useIsOverflow";

// image
import leftArrow from "assets/icons/left_arrow.png";
import rightArrow from "assets/icons/right_arrow.png";
import noCommunityimg from 'assets/images/Communities/whitelogo.png';

const BookmarkJoin = ({
  communityData = {},
  joinCommunityData = {},
  postData = {},
  userData = {},
  allUserData = {},
}) => {
  const [scrollState, setScrollState] = useState("start");
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const isOverflow = useIsOverflow(containerRef);

  const handleClick = (item) => {
    navigate(`/bookmarkdetail/${item.communityid}`, {
      state: {
        currentCommunityid: `${item.communityid}`,
        currentCommunity: `${item.name}`,
        communityData: communityData,
        postData: postData,
        userData: userData,
        allUserData: allUserData
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
      current.scrollLeft += current.clientWidth - 20;
      handleScroll();
    }
  };

  const moveLeft = () => {
    const { current } = containerRef;
    if (current) {
      current.scrollLeft -= current.clientWidth - 20;
      handleScroll();
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      handleScroll();
    }
  }, [joinCommunityData]);

  return (
    <div className={styles.stackTagsArea}>
      <div
        className={styles.classContainer}
        ref={containerRef}
        onScroll={handleScroll}
      >
        {Array.isArray(joinCommunityData) && joinCommunityData.map((item, index) => (
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
                    alt="communityImage"
                  />
                  : <img
                    className={styles.communityImage}
                    src={noCommunityimg}
                    alt="communityImage"
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

export default BookmarkJoin;
