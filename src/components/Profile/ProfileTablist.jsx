import React, { useState } from 'react';
import styles from './ProfileTablist.module.css';
import JoinPostList from 'components/Communities/CommunityJoinPostList';
import { useDataContext } from 'api/DataContext';

export const ProfileTablist = ({ userPost, userLike, userComment }) => {
    const [currentTab, clickTab] = useState(0);
    const { communityData, allUserData } = useDataContext();

    const menuArr = [
        {
            name: '게시물',
            content:
                <JoinPostList
                    postData={userPost}
                    communityData={communityData}
                    allUserData={allUserData}
                />
        },
        {
            name: '좋아요',
            content:
                <JoinPostList
                    postData={userLike}
                    communityData={communityData}
                    allUserData={allUserData}
                />
        },
        {
            name: '댓글',
            content:
                <JoinPostList
                    postData={userComment}
                    communityData={communityData}
                    allUserData={allUserData}
                />
        }
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
                {menuArr[currentTab].content}
            </div>
        </div>
    );
};

export default ProfileTablist;
