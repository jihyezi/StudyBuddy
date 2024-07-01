import React, { useState } from "react";
import Header from "components/Explore/Header";
import styles from "./Explore.module.css";

import Search from "assets/icons/Explore/search.png";
import L from "assets/icons/Explore/L.png";
import R from "assets/icons/Explore/R.png";

import PopularPost from "components/Home/PopularPost";
const Explore = ({}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
    // Add your search logic here
  };

  return (
    <div className={styles.Explore}>
      <Header />
      <div className={styles.SearchContainer}>
        <div className={styles.InputWrapper}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            className={styles.SearchInput}
            placeholder="제목, 커뮤니티, 스터디를 검색해보세요."
          />
          <img src={Search} alt="Search" className={styles.SearchIcon} />
        </div>
        <button onClick={handleSearch} className={styles.SearchButton}>
          Search
        </button>
      </div>
      <div className={styles.PopularTagContainer}>
        <div className={styles.CategoryText}>인기 태그🏷️</div>
        <div className={styles.tagContainer}>
          <button className={styles.arrowButton}>
            <img src={L} />
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
            <img src={R} />
          </button>
        </div>
      </div>
      {/* <div className={styles.HotCommunitiesContainer}>
        <div className={styles.CategoryText}>🔥 HOT한 커뮤니티 </div>
      </div>
      <div className={styles.PopularStudyContainer}>
        <div className={styles.CategoryText}>⭐️ 인기 스터디</div>
      </div> */}
    </div>
  );
};
export default Explore;
