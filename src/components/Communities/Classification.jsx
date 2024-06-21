import React, { useEffect, useState, useRef } from 'react';
import useIsOverflow from 'components/useIsOverflow';
import styles from './Classification.module.css';

import leftArrow from '../../assets/icons/left_arrow.png';
import rightArrow from '../../assets/icons/right_arrow.png';

const Classification = ({ onEventSelect }) => {
  const [scrollState, setScrollState] = useState('right');
  const [selectedButton, setSelectedButton] = useState('🔥');

  const containerRef = useRef(null);
  const isOverflow = useIsOverflow(containerRef);

  const dummyData = [
    '🔥',
    '경영/회계/사무',
    '정보통신',
    '금융/보험',
    '교육/자연/과학/사회과학',
    '법률/경찰/소방/교도/국방',
    '보건/의료',
    '사회복지/종교',
    '문화/예술/디자인/방송',
    '운전/운송',
    '영업/판매',
    '경비/청소',
    '이용/숙박/여행/오락/스포츠',
    '음식서비스',
    '건설',
    '광업자원',
    '기계',
    '재료',
    '화학',
    '섬유/의복',
    '전기/전자',
    '식품/가공',
    '인쇄/목재/가구/공예',
    '농립어업',
    '안전관리',
    '환경/에너지',
  ];

  const handleClick = (event) => {
    setSelectedButton(event);
    onEventSelect(event);
  };

  const handleScroll = () => {
    const { current } = containerRef;
    if (current) {
      if (current.scrollLeft <= (current.scrollWidth - current.clientWidth) / 2) {
        setScrollState('right');
      } else {
        setScrollState('left');
      }
    }
  };

  useEffect(() => {
    const { current } = containerRef;
    if (current) {
      current.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (current) {
        current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const moveRight = () => {
    const { current } = containerRef;
    if (current) {
      current.scrollLeft = current.scrollWidth - current.clientWidth;
    }
  };

  const moveLeft = () => {
    const { current } = containerRef;
    if (current) {
      current.scrollLeft = 0;
    }
  };

  return (
    <div className={styles.stackTagsArea}>
      <div className={styles.classContainer} ref={containerRef}>
        {dummyData.map((item, index) => (
          <button
            key={index}
            className={selectedButton === item ? styles.classificationOn : styles.classificationOff}
            onClick={() => handleClick(item)}
          >
            {item}
          </button>
        ))}
      </div>
      {isOverflow && scrollState === 'right' && (
        <div className={`${styles.overflowBox} ${styles.overflowBoxRight}`}>
          <button className={styles.scrollButton} onClick={moveRight}>
            <img src={rightArrow} style={{ width: 30, height: 30 }} alt="Right Arrow" />
          </button>
        </div>
      )}
      {isOverflow && scrollState === 'left' && (
        <div className={`${styles.overflowBox} ${styles.overflowBoxLeft}`}>
          <button className={styles.scrollButton} onClick={moveLeft}>
            <img src={leftArrow} style={{ width: 30, height: 30 }} alt="Left Arrow" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Classification;
