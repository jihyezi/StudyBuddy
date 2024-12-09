import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "pages/Explore/Explore.module.css";
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
  const [isDeleting, setIsDeleting] = useState(false);
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

  const handleSearch = async (query) => {
    const searchTerm = query || searchQuery; // query가 주어지면 그 값을 사용
    if (searchTerm.trim() && userId) {
      await addSearchHistory(userId, searchTerm);
      const history = await fetchSearchHistory(userId);
      setSearchHistory(history);
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    } else {
      console.error("Error: searchQuery is empty or userId is undefined");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(); // Enter 키를 눌렀을 때 검색
    }
  };

  const handleFocus = () => setIsFocused(true);

  const handleBlur = () => {
    if (!isDeleting) {
      setTimeout(() => setIsFocused(false), 100);
    }
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

  const handleDeleteClick = (e, searchId) => {
    e.stopPropagation();
    setIsDeleting(true);
    handleDelete(searchId).then(() => {
      setIsDeleting(false);
    });
  };

  const handleRecentSearchClick = (query) => {
    setSearchQuery(query);
    handleSearch(query); // 클릭한 검색어로 검색 실행
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
              onKeyPress={handleKeyPress}
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
                      onClick={() => handleRecentSearchClick(historyItem.query)} // 최근 검색어 클릭 시 검색 실행
                    >
                      <div className={styles.HistoryTextContainer}>
                        <div className={styles.buttonContainer}>
                          <img src={Exploresearch} alt="Search Icon" />
                          {historyItem.query}
                        </div>
                        <button
                          className={styles.deletebutton}
                          onClick={(e) =>
                            handleDeleteClick(e, historyItem.searchid)
                          }
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
          <button
            onClick={() => handleSearch()}
            className={styles.SearchButton}
          >
            Search
          </button>
        </div>
      </div>
      <div className={styles.Content}>{children}</div>
    </div>
  );
};

export default CommonLayout;
