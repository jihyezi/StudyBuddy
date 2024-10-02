import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import Header from "components/Explore/Header";
import styles from "pages/Explore/Explore.module.css"; // 새 스타일 파일 생성
import Search from "assets/icons/Explore/search.png";
import Exploresearch from "assets/icons/Explore/Explore_search.png";
import Header from "components/Header";
import {
  fetchSearchHistory,
  addSearchHistory,
  deleteSearchHistory,
} from "utils/searchHistory";

const CommonLayout = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const loadSearchHistory = async () => {
      if (userId) {
        const history = await fetchSearchHistory(userId);
        setSearchHistory(history);
      } else {
        console.error("Error: userId is undefined");
      }
    };

    loadSearchHistory();
  }, [userId]);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = async () => {
    if (searchQuery.trim() && userId) {
      await addSearchHistory(userId, searchQuery);
      const history = await fetchSearchHistory(userId);
      setSearchHistory(history);
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    } else {
      console.error("Error: searchQuery is empty or userId is undefined");
    }
  };
  // 검색창에서 엔터를 눌렀을 때도 검색이 실행되도록 설정
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };

  const handleDelete = async (searchId) => {
    if (userId) {
      await deleteSearchHistory(searchId);
      const history = await fetchSearchHistory(userId);
      setSearchHistory(history);
    } else {
      console.error("Error: userId is undefined");
    }
  };

  const handleRecentSearchClick = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className={styles.CommonLayout}>
      <Header headerName={"Explore"} />
      <div className={styles.SearchContainer}>
        <div className={styles.InputContainer}>
          <div className={styles.InputWrapper}>
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress} // 엔터 키를 누르면 검색 실행
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
                    <li
                      key={index}
                      className={styles.SearchHistoryItem}
                      onClick={() => handleRecentSearchClick(historyItem.query)}
                    >
                      <div className={styles.HistoryTextContainer}>
                        <div className={styles.buttonContainer}>
                          <img src={Exploresearch} alt="Search Icon" />
                          {historyItem.query}
                        </div>
                        <button
                          className={styles.deletebutton}
                          onClick={(e) => {
                            e.stopPropagation(); // 버튼 클릭 시 부모 요소로 이벤트 전파 막기
                            handleDelete(historyItem.searchid);
                          }}
                        >
                          ❌
                        </button>
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
      <div className={styles.Content}>{children}</div>
    </div>
  );
};

export default CommonLayout;
