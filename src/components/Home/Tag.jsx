import React, { useEffect, useState, useRef } from 'react';
import useIsOverflow from 'components/useIsOverflow';
import styles from './Tag.module.css';

import leftArrow from 'assets/icons/left_arrow.png';
import rightArrow from 'assets/icons/right_arrow.png';

const Tag = ({ onEventSelect }) => {
    const [scrollState, setScrollState] = useState('start');
    const [selectedButton, setSelectedButton] = useState('🔥');

    const containerRef = useRef(null);
    const isOverflow = useIsOverflow(containerRef);

    const dummyData = [
        '정보처리기사',
        '스터디',
        'IT',
        '자격증',
        '실기',
        '동아리',
        '면접',
        '취업',
        '코딩테스트',
        '교육',
        '카공',
        '합격 후기',
        '공부 방법'
    ];

    const handleClick = (event) => {
        setSelectedButton(event);
        onEventSelect(event);
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
            {isOverflow && (scrollState === 'middle' || scrollState === 'start') && (
                <div className={`${styles.overflowBox} ${styles.overflowBoxRight}`}>
                    <button className={styles.scrollButton} onClick={moveRight}>
                        <img src={rightArrow} style={{ width: 30, height: 30 }} alt="Right Arrow" />
                    </button>
                </div>
            )}
            {isOverflow && (scrollState === 'middle' || scrollState === 'end') && (
                <div className={`${styles.overflowBox} ${styles.overflowBoxLeft}`}>
                    <button className={styles.scrollButton} onClick={moveLeft}>
                        <img src={leftArrow} style={{ width: 30, height: 30 }} alt="Left Arrow" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Tag;
