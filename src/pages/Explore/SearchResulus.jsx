import React from "react";
import { useLocation } from "react-router-dom";
import Header from "components/Explore/Header";
import styles from "./SearchResulus.module.css";
const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

  return (
    // <div>
    //   <h1>Search Results for "{query}"</h1>
    //   {/* 검색 결과를 표시할 내용 */}
    // </div>
    <div className={styles.Explore}></div>
  );
};

export default SearchResults;
