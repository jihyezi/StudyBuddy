import React, { useState, useEffect } from "react";
import styles from "./SearchPlaceModal.module.css";
import "fonts/Font.css";
import axios from "axios";

import close from "assets/icons/Messages/close.png";
import back from "assets/icons/Post/back.png";
import search from "assets/icons/Post/search.png";

const SearchPlaceModal = ({
  closeModal,
  updateSelectedModal,
  initialValue,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue || "");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (initialValue) {
      handleSearch(); // 초기값으로 검색 수행
    }
  }, [initialValue]);

  const handleSearch = async () => {
    if (searchTerm.length > 0) {
      try {
        const client_id = process.env.NAVER_CLIENT_ID;
        const client_secret = process.env.NAVER_CLIENT_SECRET;
        const api_url = `/api/v1/search/local.json?query=${encodeURI(
          searchTerm
        )}&display=10`;
        const options = {
          headers: {
            "X-Naver-Client-Id": client_id,
            "X-Naver-Client-Secret": client_secret,
          },
        };
        const response = await axios.get(api_url, options);

        // HTML 태그 제거 함수
        const removeHtmlTags = (str) => {
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = str;
          return tempDiv.textContent || tempDiv.innerText || "";
        };

        // 검색 결과에서 title 전처리
        const processedResults = response.data.items.map((item) => ({
          ...item,
          title: removeHtmlTags(item.title), // HTML 태그 제거
        }));

        setSearchResults(processedResults);
      } catch (error) {
        console.error("Error fetching data from Naver API:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleDirectInputClick = (title) => {
    updateSelectedModal(title); // 클릭한 title로 업데이트
    closeModal();
  };

  return (
    <div className={styles.searchBookModal}>
      <div className={styles.searchBookModalHeader}>
        <img
          className={styles.closeIcon}
          src={back}
          alt="close"
          onClick={closeModal}
        />
        <div className={styles.newMessage}>장소</div>
      </div>
      <div className={styles.searchBookModalMiddleContainer}>
        <div className={styles.searchBookModalMiddle}>
          <img className={styles.searchIcon} src={search} alt="search" />
          <input
            className={styles.input}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className={styles.send} onClick={handleSearch}>
          Search
        </div>
      </div>

      <div className={styles.resultList}>
        {searchTerm && (
          <div
            className={styles.directInput}
            onClick={() => handleDirectInputClick(searchTerm)}
          >
            직접 입력 '{searchTerm}' 사용하기
          </div>
        )}
        {searchResults.map((place) => (
          <div
            className={styles.resultItem}
            key={place.link}
            onClick={() => handleDirectInputClick(place.title)}
          >
            <div className={styles.title}>{place.title}</div>
            <div className={styles.address}>{place.address}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPlaceModal;
