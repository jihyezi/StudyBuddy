import React, { useEffect, useState, useRef } from "react";

import styles from "./Bookmarks.module.css";

// component
import Header from "components/Communities/Header";
import Classification from "components/Communities/Classification";
import JoinCommunity from "components/Communities/JoinCommunity";
import CommunityDetailClick from "components/Communities/CommunityDetailClick";
import Post from "components/Communities/Post";
import PostList from "components/Communities/CommunityPostList";
import JoinPostList from "components/Communities/CommunityJoinPostList";
import Recommended from "pages/Recommended/Recommended";
import { dummyPostData } from "components/Dummydata";
import BookmarkJoin from "components/Bookmark/BookmarkJoin";

const Bookmarks = ({ }) => {
  const [selectedEvent, setSelectEvent] = useState('');


  const handleEventSelect = (event) => {
    setSelectEvent(event);
  };

  return (
    <div className={styles.community}>
      <Header />
      <div className={styles.classification}>
        <BookmarkJoin onEventSelect={handleEventSelect} />
      </div>

      <JoinPostList postData={dummyPostData} />
    </div>
  );
};
export default Bookmarks;
