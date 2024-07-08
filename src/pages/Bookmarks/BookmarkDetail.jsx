import React from "react";

import Header from "components/Communities/Header";
import { dummyPostData } from "components/Dummydata";
import JoinPostList from "components/Communities/CommunityJoinPostList";
import styles from './BookmarkDetail.module.css'

const BookmarkDetail = () => {
    return (
        <div className={styles.container}>
            <Header />
            <JoinPostList postData={dummyPostData} />
        </div>
    )
}

export default BookmarkDetail;
