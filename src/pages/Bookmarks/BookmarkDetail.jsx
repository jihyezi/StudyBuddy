import React from "react";

import Header from "components/Header";
import { dummyPostData } from "components/Dummydata";
import JoinPostList from "components/Communities/CommunityJoinPostList";
import styles from './BookmarkDetail.module.css'

const BookmarkDetail = () => {
    return (
        <div className={styles.container}>
            <Header headerName={dummyPostData.community} />
            <JoinPostList postData={dummyPostData} />
        </div>
    )
}

export default BookmarkDetail;
