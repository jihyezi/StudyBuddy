import React, { useEffect, useState } from "react";
import styles from "./All.module.css";
import Filter from "components/Studies/Filter";
import Search from "assets/icons/Explore/search.png";
import StudyPost from "components/Studies/StudyPost";
import supabase from "components/supabaseClient";
import loadinggif from "assets/images/loading.gif";

const All = ({ studyData, userData, allUserData, isLoading }) => {
  const [posts, setPosts] = useState([]);
  const [likesCount, setLikesCount] = useState({});
  const [commentsCount, setCommentsCount] = useState({});
  const [selectOption, setSelectOption] = useState("전체");
  const [searchText, setSearchText] = useState("");

  const handleSelectOption = (option) => {
    setSelectOption(option);
  };

  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value);
  };

  const filterPosts = studyData.filter((p) =>
    selectOption === "전체" ? true : p.completion === selectOption
  );

  const searchPosts = filterPosts.filter(
    (p) =>
      p.title.includes(searchText) ||
      p.description.includes(searchText) ||
      p.tag.includes(searchText)
  );

  const loading = isLoading;

  return (
    <div className={styles.allContainer}>
      <div className={styles.searchContainer}>
        <div className={styles.filter}>
          <Filter placeholder={"전체"} onOptionSelect={handleSelectOption} />
        </div>
        <div className={styles.searchinputfiled}>
          <div className={styles.InputWrapper}>
            <input
              type="text"
              className={styles.SearchInput}
              placeholder="스터디를 검색해보세요."
              onChange={handleSearchTextChange}
              value={searchText}
            />
            <img src={Search} alt="Search" className={styles.SearchIcon} />
          </div>
        </div>
      </div>
      {loading ? (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100vh",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={loadinggif} style={{ width: "80px" }} alt="Loading" />
        </div>
      ) : (
        searchPosts.map((post, index) => (
          <StudyPost
            key={index}
            study={post}
            userData={userData}
            allUserData={allUserData}
          />
        ))
      )}
    </div>
  );
};

export default All;
