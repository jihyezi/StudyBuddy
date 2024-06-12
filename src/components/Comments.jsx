import React from 'react';
import styles from './Comments.module.css'

const Comments = (props) => {
    return (
        <div className={styles.Container}>
            <div>
                <img className={styles.Profile} src={props.profile} />
            </div>
            <div className={styles.ContentContainer}>
                <div className={styles.Info}>
                    <span className={styles.Nickname}>{props.nickname}</span>
                    <span className={styles.Time}>{props.time}</span>
                </div>
                <span className={styles.Content}>{props.content}</span>
                <button className={styles.Button}>답글 달기</button>
            </div>

        </div>
    )
}

export default Comments;
