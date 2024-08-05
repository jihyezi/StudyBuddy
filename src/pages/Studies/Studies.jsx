import Header from "components/Communities/Header";
import styles from "./Studies.module.css";
import React, { useEffect, useState, useRef } from "react";

// component
import Classification from "components/Communities/Classification";
import JoinCommunity from "components/Communities/JoinCommunity";
import CommunityDetailClick from "components/Communities/CommunityDetailClick";
import Post from "components/Communities/Post";
import PostList from "components/Communities/CommunityPostList";
import JoinPostList from "components/Communities/CommunityJoinPostList";
import Recommended from "pages/Recommended/Recommended";
import { dummyPostData } from "components/Dummydata";
import Toptab from "components/Studies/Toptab";

const Studies = ({ }) => {

  return (
    <div className={styles.studycontainer}>
      <Header />
      <div className={styles.tabstyle}>
        <Toptab />
      </div>
    </div>
  );
}

export default Studies;
