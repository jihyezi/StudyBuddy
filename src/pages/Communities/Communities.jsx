import React, { useEffect, useState, useRef } from "react";

import styles from "./Communities.module.css";

// component
import Header from "components/Header";
import Classification from "components/Communities/Classification";
import JoinCommunity from "components/Communities/JoinCommunity";
import CommunityDetailClick from "components/Communities/CommunityDetailClick";
import Post from "components/Communities/Post";
import PostList from "components/Communities/CommunityPostList";
import JoinPostList from "components/Communities/CommunityJoinPostList";
import Recommended from "pages/Recommended/Recommended";
import { dummyPostData } from "components/Dummydata";

const Communities = ({ }) => {
  const [selectedEvent, setSelectEvent] = useState('');


  const handleEventSelect = (event) => {
    setSelectEvent(event);
  };

  return (
    <div className={styles.community}>
      <Header headerName={'Communities'} />
      <div className={styles.classification}>
        {/* <Classification onEventSelect={handleEventSelect} /> --> 가입한 커뮤니티가 없을 때 나오는 화면*/}
        <JoinCommunity onEventSelect={handleEventSelect} />
      </div>

      {/* <PostList postData={dummyPostData} selectedEvent={selectedEvent} /> */}

      <JoinPostList postData={dummyPostData} />
    </div>
  );
};
export default Communities;
