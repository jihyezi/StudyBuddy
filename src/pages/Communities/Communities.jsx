import React, { useEffect, useState, useRef } from "react";

import styles from "./Communities.module.css";

// component
import Header from "components/Communities/Header";
import Classification from "components/Communities/Classification";
import JoinCommunity from "components/Communities/JoinCommunity";
import CommunityDetailClick from "components/Communities/CommunityDetailClick";
import Post from "components/Communities/Post";

const Communities = ({}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />
      <div className={styles.classification}>
        <Classification />
      </div>
      <div className={styles.joinCommunity}>
        <JoinCommunity />
      </div>
      <div>
        <CommunityDetailClick />
      </div>
      <div>
        <Post />
        <Post />
      </div>
    </div>
  );
};
export default Communities;
