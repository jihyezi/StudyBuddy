import React, { useState } from 'react';
import styles from './ProfileTablist.module.css';
import JoinPostList from 'components/Communities/CommunityJoinPostList';

export const ProfileTablist = ({ community, user, allUser, userPost, userLike, userComment }) => {
    const [currentTab, clickTab] = useState(0);

    const menuArr = [
        {
            name: '게시물',
            content:
                <JoinPostList
                    postData={userPost}
                    communityData={community}
                    userData={user}
                    allUserData={allUser}
                />
        },
        {
            name: '좋아요',
            content:
                <JoinPostList
                    postData={userLike}
                    communityData={community}
                    userData={user}
                    allUserData={allUser}
                />
        },
        {
            name: '댓글',
            content:
                <JoinPostList
                    postData={userComment}
                    communityData={community}
                    userData={user}
                    allUserData={allUser}
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
