<<<<<<< HEAD
import React from "react";
=======
import React, { useState } from "react";
import Header from "components/Header";
>>>>>>> d15fb8376770b2463865efabbbba1707a70639e3
import styles from "./Explore.module.css";
import L from "assets/icons/Explore/L.png";
import R from "assets/icons/Explore/R.png";
import HotCommunity from "components/Home/HotCommunity";
import StudyPost from "components/Explore/ExploreStudyPost";
import Tag from "components/Home/Tag";

<<<<<<< HEAD
const Explore = () => {
=======
const Explore = ({ }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState([
    "온라인 스터디",
    "정보처리기사",
    "프론트엔드",
  ]);
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSearchHistory((prevHistory) => [searchQuery, ...prevHistory]);
      setSearchQuery("");
      console.log("Searching for:", searchQuery);
      // Add your search logic here
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 200); // Brief delay to allow click event on history items
  };

>>>>>>> d15fb8376770b2463865efabbbba1707a70639e3
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
<<<<<<< HEAD
=======
      <Header headerName={'Explore'} />
      <div className={styles.SearchContainer}>
        <div className={styles.InputContainer}>
          <div className={styles.InputWrapper}>
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={styles.SearchInput}
              placeholder="제목, 커뮤니티, 스터디를 검색해보세요."
            />
            <img src={Search} alt="Search" className={styles.SearchIcon} />
            {isFocused && (
              <div className={styles.SearchHistoryContainer}>
                <ul className={styles.SearchHistoryList}>
                  <div className={styles.SearchText}>최근 검색어</div>
                  {searchHistory.map((historyItem, index) => (
                    <li key={index} className={styles.SearchHistoryItem}>
                      <div className={styles.HistoryTextContainer}>
                        <img src={Exploresearch} />
                        {historyItem}
                        {/* <div>X</div>
                    <img src={Exploredelete} /> */}
                        {/* <button className={styles.deletebutton}>
                      
                    </button> */}
                        {/* <button>
                      
                    </button> 이미지가 깨져서 보임 */}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <button onClick={handleSearch} className={styles.SearchButton}>
            Search
          </button>
        </div>

      </div>
>>>>>>> d15fb8376770b2463865efabbbba1707a70639e3
      <div className={styles.PopularTagContainer}>
        <div className={styles.CategoryText}>인기 태그 🏷️</div>
        <Tag />
      </div>
      <div className={styles.HotCommunitiesContainer}>
        <div className={styles.CategoryText}>🔥 HOT 커뮤니티 </div>
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
