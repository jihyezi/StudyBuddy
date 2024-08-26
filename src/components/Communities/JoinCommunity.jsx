import React, { useState, useRef } from "react";
import styles from "./JoinCommunity.module.css";
import { useNavigate } from "react-router-dom";
import useIsOverflow from 'components/useIsOverflow';
import leftArrow from '../../assets/icons/left_arrow.png';
import rightArrow from '../../assets/icons/right_arrow.png';
import noimage from 'assets/images/Profile/nobackground.png';

const JoinCommunity = ({ onEventSelect, communityInfo }) => {
  const [scrollState, setScrollState] = useState('start');
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const isOverflow = useIsOverflow(containerRef);

  const handleClick = (item) => {
    const imageUrl = item.image
      ? `https://vrpwhfbfzqwmqlhwhbtu.supabase.co/storage/v1/object/public/Images/community/${item.image}`
      : noimage;

    setSelectedItem(item);
    onEventSelect(item);
    navigate(`/communitydetail`, {
      state: {
        id: `${item.id}`,
        img: imageUrl, // Ensure this is set correctly
        community: `${item.name}`,
        description: `${item.description}`,
        rules: item.rules,
      },
    });
  };

  const handleScroll = () => {
    const { current } = containerRef;
    if (current) {
      const isAtStart = current.scrollLeft === 0;
      const isAtEnd = current.scrollLeft + current.clientWidth >= current.scrollWidth;
      if (isAtStart) {
        setScrollState('start');
      } else if (isAtEnd) {
        setScrollState('end');
      } else {
        setScrollState('middle');
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

  return (
    <div className={styles.stackTagsArea}>
      <div className={styles.classContainer} ref={containerRef} onScroll={handleScroll}>
        {communityInfo.map((item, index) => {
          const imageUrl = item.image
            ? `https://vrpwhfbfzqwmqlhwhbtu.supabase.co/storage/v1/object/public/Images/community/${item.image}`
            : noimage;

          return (
            <div
              key={index}
              className={styles.classification}
              onClick={() => handleClick(item)}
            >
              <div className={styles.joinCommunity}>
                <div className={styles.communityImageContainer}>
                  <img
                    className={styles.communityImage}
                    src={imageUrl}
                    alt={item.name || "Default Image"}
                  />
                </div>
                <div className={styles.communityName}>{item.name}</div>
              </div>
            </div>
          );
        })}
      </div>
      {isOverflow && (scrollState === 'middle' || scrollState === 'end') && (
        <div className={`${styles.overflowBox} ${styles.overflowBoxLeft}`}>
          <button className={styles.scrollButton} onClick={moveLeft}>
            <img src={leftArrow} style={{ width: 30, height: 30 }} alt="Left Arrow" />
          </button>
        </div>
      )}
      {isOverflow && (scrollState === 'middle' || scrollState === 'start') && (
        <div className={`${styles.overflowBox} ${styles.overflowBoxRight}`}>
          <button className={styles.scrollButton} onClick={moveRight}>
            <img src={rightArrow} style={{ width: 30, height: 30 }} alt="Right Arrow" />
          </button>
        </div>
      )}
    </div>
  );
};

export default JoinCommunity;
