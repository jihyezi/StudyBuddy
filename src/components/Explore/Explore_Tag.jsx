import React, { useEffect, useState, useRef } from "react";
import useIsOverflow from "components/useIsOverflow";
import styles from "../Home/Tag.module.css";
import supabase from "components/supabaseClient";

import { useNavigate } from "react-router-dom"; // useNavigate 훅 임포트

import leftArrow from "assets/icons/left_arrow.png";
import rightArrow from "assets/icons/right_arrow.png";

const Explore_Tag = ({ onEventSelect = () => {}, onTagSelect = () => {} }) => {
  const [scrollState, setScrollState] = useState("start");
  const [selectedButton, setSelectedButton] = useState("");
  const [tags, setTags] = useState([]);
  const navigate = useNavigate(); // useNavigate 사용

  const containerRef = useRef(null);
  const isOverflow = useIsOverflow(containerRef);

  const fetchTags = async () => {
    const { data, error } = await supabase.from("Study").select("tag");

    if (error) {
      console.error("Error fetching tags:", error);
    } else {
      const allTags = data.flatMap((item) => item.tag);
      const uniqueTags = Array.from(new Set(allTags));
      const updatedTags = [...uniqueTags.filter((tag) => tag !== "")];
      setTags(updatedTags);
    }
  };

  const handleClick = (tag) => {
    setSelectedButton(tag);
    onTagSelect(tag); // 태그 선택 이벤트 전달
    navigate(`/search?query=${encodeURIComponent(tag)}`); // 쿼리 파라미터로 이동
  };

  const handleScroll = () => {
    const { current } = containerRef;

    if (current) {
      const isAtStart = current.scrollLeft === 0;
      const isAtEnd =
        current.scrollLeft + current.clientWidth >= current.scrollWidth - 8;

      if (isAtStart) {
        setScrollState("start");
      } else if (isAtEnd) {
        setScrollState("end");
      } else {
        setScrollState("middle");
      }
    }
  };

  useEffect(() => {
    fetchTags();
    const { current } = containerRef;
    if (current) {
      current.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (current) {
        current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    onEventSelect("click", selectedButton);
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
        {tags.map((item, index) => (
          <button
            key={index}
            className={
              selectedButton === item
                ? styles.classificationOn
                : styles.classificationOff
            }
            onClick={() => handleClick(item)}
          >
            {item}
          </button>
        ))}
      </div>
      {(scrollState === "middle" || scrollState === "start") && (
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
      {(scrollState === "middle" || scrollState === "end") && (
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
    </div>
  );
};

export default Explore_Tag;