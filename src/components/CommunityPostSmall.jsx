import React from "react";
import styles from './CommunityPostSmall.module.css'

import imgbackground from '../assets/images/bookmarkbackground.png';

const CommunityPostSmall = (props) => {
    return (
        <div className={styles.communityPostContainer}>
            <div className={styles.communityPostLeft}>
                <img src={props.communityimg} className={styles.communityPostImage} />
                <div className={styles.communityPostDetails}>
                    <div className={styles.communityPostTitle}>{props.communityname}</div>
                    <div className={styles.communityPostInfo}>
                        <div className={styles.communityPostInfoRow}>
                            <span className={styles.communityPostInfoLabel}>인원</span>
                            <span className={styles.communityPostInfoValue}>{props.person}명</span>
                        </div>
                        <div className={styles.communityPostInfoRow}>
                            <span className={styles.communityPostInfoLabel}>게시글</span>
                            <span className={styles.communityPostInfoValue}>{props.post}개</span>
                        </div>
                        <div className={styles.communityPostInfoRow}>
                            <span className={styles.communityPostInfoLabel}>시작일</span>
                            <span className={styles.communityPostInfoValue}>{props.date}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.communityPostIconWrapper}>
                <img src={imgbackground} className={styles.communityPostIconBackground} />
                <img src={props.commmunityicon} className={styles.communityPostIconPalette} />
            </div>
        </div>
    );
}

export default CommunityPostSmall;
