import React, { useState } from 'react';
import styles from './ProfileTablist.module.css';
import JoinPostList from 'components/Communities/CommunityJoinPostList';
import { dummyPostData } from 'components/Dummydata';

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
                    <div
                        key={index}
                        className={styles.communityTab}
                        onClick={() => selectMenuHandler(index)}
                    >
                        <span
                            className={`${styles.communityTabText} ${index === currentTab ? styles.selected : ''}`}
                        >
                            {el.name}
                        </span>
                        {index === currentTab && <div className={styles.communityTabClick} />}
                    </div>
                ))}
            </div>
            <div className={styles.desc}>
                {menuArr[currentTab].content}
            </div>
        </div>
    );
};

export default ProfileTablist;
