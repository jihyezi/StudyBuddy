import React, { useState, useEffect } from "react";
import styles from "./SearchBookModal.module.css";
import "fonts/Font.css";
import close from "assets/icons/Messages/close.png";
import axios from "axios";

const SearchBookModal = ({ closeModal, updateSelectedModal, initialValue }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue || "");
  // const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    if (searchTerm.length > 0) {
      try {
        const response = await axios.get(
          `${
            process.env.REACT_APP_BACKEND_URL
          }/api/searchBook?query=${encodeURIComponent(searchTerm)}`
        );
        setSearchResults(response.data.items);
      } catch (error) {
        console.error("Error fetching data:", error);
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
    updateSelectedModal(title);
    closeModal();
  };

  useEffect(() => {
    if (searchTerm) {
      handleSearch();
    }
  }, [searchTerm]);

  return (
    <div className={styles.searchBookModal}>
      <div className={styles.searchBookModalHeader}>
        <img
          className={styles.closeIcon}
          src={close}
          alt="close"
          onClick={closeModal}
        />
        <div className={styles.newMessage}>책 검색</div>
        <div className={styles.send} onClick={handleSearch}>
          Search
        </div>
      </div>
      <div className={styles.searchBookModalMiddle}>
        <span className={styles.sendTo}>책 :</span>
        <input
          className={styles.input}
          type="text"
          placeholder="Search Book..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
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
        {searchResults?.map((book) => (
          <div
            className={styles.resultItem}
            key={book.link}
            onClick={() => handleDirectInputClick(book.title)}
          >
            <img
              src={book.image}
              alt={book.title}
              className={styles.bookImage}
            />
            <span className={styles.bookTitle}>{book.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBookModal;
