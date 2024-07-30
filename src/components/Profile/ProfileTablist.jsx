import React, { useState } from 'react';
import styles from './ProfileTablist.module.css';
import JoinPostList from 'components/Communities/CommunityJoinPostList';
import Post from 'components/Communities/Post';
import { dummyPostData } from "components/Dummydata";
import RulePage from 'pages/Communities/RulePage';
import MemberPage from 'pages/Communities/MemberPage';

export const ProfileTablist = () => {
    const [currentTab, clickTab] = useState(0);

    const menuArr = [
        { name: '게시물', content: <JoinPostList postData={dummyPostData} /> },
        { name: '스터디', content: <JoinPostList postData={dummyPostData} /> },
        { name: '좋아요', content: <JoinPostList postData={dummyPostData} /> },
        { name: '댓글', content: <JoinPostList postData={dummyPostData} /> }
    ];

    const selectMenuHandler = (index) => {
        clickTab(index);
    };

    return (
        <div>
            <div className={styles.communityDetailClick}>
                {menuArr.map((el, index) => (
                    <div key={index} className={styles.communityTab} onClick={() => selectMenuHandler(index)}>
                        <span className={
                            index === currentTab
                                ? `${styles[`community${el.name}Post`]} ${styles.selected}`
                                : styles[`community${el.name}Post`]
                        }>
                            {el.name}
                        </span>
                        {index === currentTab && <div className={styles.communityTabClick} />}
                    </div>
                ))}
            </div>
            <div className={styles.desc}>
                <p>{menuArr[currentTab].content}</p>
            </div>
        </div>
    );
};

export default ProfileTablist;
