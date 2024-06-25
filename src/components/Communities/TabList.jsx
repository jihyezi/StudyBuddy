import React, { useState } from 'react';
import styles from './TabList.module.css';
import JoinPostList from './CommunityJoinPostList';
import Post from './Post';
import { dummyPostData } from "components/Dummydata";
import RulePage from 'pages/Communities/RulePage';
import MemberPage from 'pages/Communities/MemberPage';

export const TabList = () => {
    const [currentTab, clickTab] = useState(0);

    const menuArr = [
        { name: '인기', content: <JoinPostList postData={dummyPostData} /> },
        { name: '최근', content: <JoinPostList postData={dummyPostData} /> },
        { name: '규칙', content: <RulePage /> },
        { name: '멤버', content: <MemberPage /> }
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

export default TabList;