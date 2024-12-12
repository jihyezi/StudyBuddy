import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import Header from "components/Header";
import JoinPostList from "components/Communities/CommunityJoinPostList";
import styles from './BookmarkDetail.module.css'

const BookmarkDetail = () => {
    const location = useLocation();
    const {
        communityData = {},
        postData = [],
        userData = {},
        allUserData = {},
        currentCommunity,
        currentCommunityid
    } = location.state;

    const filterPost = Array.isArray(postData) ?
        postData.filter((post) => post.communityid === Number(currentCommunityid)) : [];

    return (
        <div className={styles.container}>
            <Header headerName={currentCommunity} />
            <JoinPostList
                communityData={communityData}
                postData={filterPost}
                allUserData={allUserData}
                userData={userData}
                newPost
            />
        </div>
    )
}

export default BookmarkDetail;
