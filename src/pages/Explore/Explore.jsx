import React from "react";
import styles from "./Explore.module.css";
import L from "assets/icons/Explore/L.png";
import R from "assets/icons/Explore/R.png";
import HotCommunity from "components/Home/HotCommunity";
import StudyPost from "components/ExploreStudyPost";

const Explore = () => {
  const postProps = {
    state: "1",
    title: "정보처리기사 온라인 스터디 ",
    content:
      "정보처리기사 온라인 스터디 모집합니다! 디코에서 주 3회 스터디 진행할 예정입니다!!",
    tag: ["정보처리기사", "온라인 스터디", "자격증"],
    person: 5,
    type: "온라인",
  };

  return (
    <div className={styles.Explore}>
      <div className={styles.PopularTagContainer}>
        <div className={styles.CategoryText}>인기 태그🏷️</div>
        <div className={styles.tagContainer}>
          <button className={styles.arrowButton}>
            <img src={L} alt="Left Arrow" />
          </button>
          <button className={styles.tagButton}>온라인 스터디</button>
          <button className={styles.tagButton}>오프라인 스터디</button>
          <button className={styles.tagButton}>정보처리기사</button>
          <button className={styles.tagButton}>면접</button>
          <button className={styles.tagButton}>프론트엔드</button>
          <button className={styles.tagButton}>프로젝트</button>
          <button className={styles.tagButton}>정보보안기사</button>
          <button className={styles.tagButton}>JavaScript</button>
          <button className={styles.arrowButton}>
            <img src={R} alt="Right Arrow" />
          </button>
        </div>
      </div>
      <div className={styles.HotCommunitiesContainer}>
        <div className={styles.CategoryText}>🔥HOT한 커뮤니티 </div>
        <div className={styles.scrollContainer}>
          <div className={styles.HotCommunityContainer}>
            <HotCommunity />
            <HotCommunity />
            <HotCommunity />
          </div>
        </div>
      </div>
      <div className={styles.PopularStudyContainer}>
        <div className={styles.CategoryText}>⭐️ 인기 스터디</div>
        <div className={styles.StudyPostContainer}>
          <StudyPost
            state={postProps.state}
            title={postProps.title}
            content={postProps.content}
            tag={postProps.tag}
            person={postProps.person}
            type={postProps.type}
          />
          <StudyPost
            state={postProps.state}
            title={postProps.title}
            content={postProps.content}
            tag={postProps.tag}
            person={postProps.person}
            type={postProps.type}
          />
        </div>
      </div>
    </div>
  );
};

export default Explore;
