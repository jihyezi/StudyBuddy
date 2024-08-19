import React, { useState } from "react";
import styles from "./SearchBookModal.module.css";
import "fonts/Font.css";
import close from "assets/icons/Messages/close.png";

const results = [
  "1차 합격",
  "1차 불합격",
  "2차 합격",
  "2차 불합격",
  "필기 합격",
  "필기 불합격",
  "실기 합격",
  "실기 불합격",
  "최종 합격",
  "최종 불합격",
];

const SearchResultModal = ({ closeModal, updateSelectedModal }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);

  const handleSearch = () => {
    if (searchTerm) {
      const resultsFiltered = results.filter((result) =>
        result.includes(searchTerm)
      );
      setFilteredResults(resultsFiltered);
    } else {
      setFilteredResults([]);
    }
  };

  const handleDirectInputClick = (result) => {
    updateSelectedModal(result);
    closeModal();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={styles.searchBookModal}>
      <div className={styles.searchBookModalHeader}>
        <img
          className={styles.closeIcon}
          src={close}
          alt="close"
          onClick={closeModal}
        />
        <div className={styles.newMessage}>결과 검색</div>
        <div className={styles.send} onClick={handleSearch}>
          Search
        </div>
      </div>
      <div className={styles.searchBookModalMiddle}>
        <span className={styles.sendTo}>결과 :</span>
        <input
          className={styles.input}
          type="text"
          placeholder="Search Result..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown} // Enter 키 이벤트 처리
        />
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
        {filteredResults.map((result) => (
          <div
            className={styles.resultItem}
            key={result}
            onClick={() => handleDirectInputClick(result)}
          >
            {result}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResultModal;
