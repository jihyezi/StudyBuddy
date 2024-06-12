import React from "react";
import styles from "./Home.module.css";

// component
import HotCommunity from "components/Home/HotCommunity";
import PopularPost from "components/Home/PopularPost";
import RecentCommunity from "components/Home/RecentCommunity";
import PopularStudy from "components/Home/PopularStudy";

const Home = ({}) => {
  return (
    <div className={styles.home}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <HotCommunity />
        <HotCommunity />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <PopularPost />
        <PopularPost />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <RecentCommunity />
        <RecentCommunity />
      </div>
      <div>
        <PopularStudy />
        <PopularStudy />
        <PopularStudy />
        <PopularStudy />
        <PopularStudy />
      </div>
    </div>
  );
};

export default Home;
