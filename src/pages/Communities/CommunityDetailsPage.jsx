import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";
import supabase from "components/supabaseClient";

import styles from './CommunityDetailsPage.module.css';
import TabList from "components/Communities/TabList";

import imgbackground from 'assets/images/bookmarkbackground.png';
import commmunityicon from 'assets/icons/palette.png';
import Header from "components/Header";

const CommunityDetailsPage = () => {
    const location = useLocation();
    const { userData, commentData, postData, communityData, ...communityInfo } = location.state;
    const [isJoined, setIsJoined] = useState(false);

    const handleJoinClick = () => {
        setIsJoined(!isJoined);
    };

    const filteredPosts = postData.filter((post) => Number(post.communityid) === Number(communityInfo.id));

    return (
        <div className={styles.container}>
            <Header headerName={communityInfo.community} />
            <div className={styles.imageWrapper}>
                <div className={styles.imageContainer}>
                    <img src={communityInfo.img} alt="profile" className={styles.image} />
                </div>
                <div className={styles.iconWrapper}>
                    <div className={styles.communityPostIconWrapper}>
                        <img src={imgbackground} className={styles.communityPostIconBackground} />
                        <img src={commmunityicon} className={styles.communityPostIconPalette} />
                    </div>
                </div>
            </div>

            <div className={styles.details}>
                <div className={styles.header}>
                    <div className={styles.communityName}>{communityInfo.community}</div>
                    <button
                        className={isJoined ? styles.joinButtonActive : styles.joinButton}
                        onClick={handleJoinClick}
                    >
                        {isJoined ? '나가기' : '가입'}
                    </button>
                </div>
                <div className={styles.description}>{communityInfo.description}</div>
            </div>
            <TabList communityInfo={communityInfo} communityData={communityData} postData={filteredPosts} userData={userData} commentData={commentData} />
        </div>
    );
};


export default CommunityDetailsPage;
