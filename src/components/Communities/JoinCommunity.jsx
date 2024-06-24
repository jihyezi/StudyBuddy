import React, { useEffect, useState, useRef } from "react";
import styles from "./JoinCommunity.module.css";
import { Link, NavLink } from "react-router-dom";
import useIsOverflow from 'components/useIsOverflow';

// image
import cat from "assets/images/Communities/1.jpg";
import leftArrow from '../../assets/icons/left_arrow.png';
import rightArrow from '../../assets/icons/right_arrow.png';
import profile from '../../assets/icons/Communities/communityprofile.jpeg'

const JoinCommunity = ({ onEventSelect }) => {
  const [scrollState, setScrollState] = useState('start');
  const [selectedItem, setSelectedItem] = useState(null);

  const containerRef = useRef(null);
  const isOverflow = useIsOverflow(containerRef);

  const dummyData = [
    {
      id: 1,
      img: cat,
      community: '정보보안기사'
    },
    {
      id: 2,
      img: cat,
      community: '정보보안기사'
    },
    {
      id: 3,
      img: cat,
      community: '정보보안기사'
    },
    {
      id: 4,
      img: cat,
      community: '정보보안기사'
    },
    {
      id: 5,
      img: cat,
      community: '정보보안기사'
    },
    {
      id: 6,
      img: cat,
      community: '정보보안기사'
    },
    {
      id: 7,
      img: profile,
      community: '정보보안기사'
    },
    {
      id: 8,
      img: profile,
      community: '정보보안기사'
    },
    {
      id: 9,
      img: profile,
      community: '정보보안기사'
    },
    {
      id: 10,
      img: profile,
      community: '정보보안기사'
    },
  ];

  const handleClick = (item) => {
    setSelectedItem(item);
    onEventSelect(item);
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

  return (
    <div className={styles.stackTagsArea}>
      <div className={styles.classContainer} ref={containerRef} onScroll={handleScroll}>
        {dummyData.map((item, index) => (
          <div
            key={index}
            className={styles.classification}
            onClick={() => handleClick(item)}
          >
            <Link
              to={`/community/${item.id}`}
              key={index}
              style={{
                color: "#333333",
                textDecoration: "none",
                verticalAlign: "middle",
              }}
            >
              <div className={styles.joinCommunity}>
                <div className={styles.communityImageContainer}>
                  <img className={styles.communityImage} src={item.img} alt="cat" />
                </div>
                <div className={styles.communityName}>{item.community}</div>
              </div>
            </Link>
          </div>
        ))}

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