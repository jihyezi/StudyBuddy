import React from "react";
<<<<<<< HEAD
import styles from './StudyPost.module.css';

import heart_off from '../assets/icons/favorite_off.png';
import heart_on from '../assets/icons/favorite_on.png';
import comment from '../assets/icons/comment.png';
import share from '../assets/icons/share.png';
import person from '../assets/icons/person.png';

const StudyPost = (props) => {
    return (
        <div className={styles.StudyPostContainer}>
            <div className={styles.StudyPostWrapper}>
                <div className={styles.StudyPostTitleContainer}>
                    {props.state === '1' ? <div className={styles.StudyPostState}>모집중</div> : <div className={styles.StudyPostState2}>모집완료</div>}
                    <div className={styles.StudyPostTitle}>{props.title}</div>
                </div>
                <div className={styles.StudyPostDescription}>{props.content}</div>
                <div className={styles.StudyPostTags}>
                    {props.tag.map((tag, index) => (
                        <div key={index} className={styles.StudyPostTag}>{tag}</div>
                    ))}
                </div>

                <div className={styles.StudyPostFooter}>
                    <div className={styles.StudyPostIconGroup}>
                        <div className={styles.StudyPostIcon}>
                            <img src={person} alt="person" />
                            <div style={{ color: '#606060', fontSize: 12, fontWeight: 500 }}>{props.person}명</div>
                        </div>
                        <div style={{ width: 2, height: 2, background: '#606060', borderRadius: 25 }} />
                        <div style={{ color: '#606060', fontSize: 12, fontWeight: 500 }}>{props.type}</div>
                    </div>
                    <div className={styles.StudyPostIconGroup}>
                        <div className={styles.StudyPostIcon}>
                            <img src={heart_off} alt="heart_off" />
                            <span>123</span>
                        </div>
                        <div className={styles.StudyPostIcon}>
                            <img src={comment} alt="comment" />
                            <span>123</span>
                        </div>
                        <div className={styles.StudyPostIcon}>
                            <img src={share} alt="share" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
=======
import styles from "./StudyPost.module.css";

import heart_off from "../assets/icons/favorite_off.png";
import heart_on from "../assets/icons/favorite_on.png";
import comment from "../assets/icons/comment.png";
import share from "../assets/icons/share.png";
import person from "../assets/icons/person.png";

const StudyPost = (props) => {
  return (
    <div className={styles.StudyPostContainer}>
      <div className={styles.StudyPostWrapper}>
        <div className={styles.StudyPostTitleContainer}>
          {props.state === "1" ? (
            <div className={styles.StudyPostState}>모집중</div>
          ) : (
            <div className={styles.StudyPostState2}>모집완료</div>
          )}
          <div className={styles.StudyPostTitle}>{props.title}</div>
        </div>
        <div className={styles.StudyPostDescription}>{props.content}</div>
        <div className={styles.StudyPostTags}>
          {props.tag.map((tag, index) => (
            <div key={index} className={styles.StudyPostTag}>
              {tag}
            </div>
          ))}
        </div>

        <div className={styles.StudyPostFooter}>
          <div className={styles.StudyPostIconGroup}>
            <div className={styles.StudyPostIcon}>
              <img src={person} alt="person" />
              <div style={{ color: "#606060", fontSize: 12, fontWeight: 500 }}>
                {props.person}명
              </div>
            </div>
            <div
              style={{
                width: 2,
                height: 2,

                background: "#606060",
                borderRadius: 25,
              }}
            />
            <div style={{ color: "#606060", fontSize: 12, fontWeight: 500 }}>
              {props.type}
            </div>
          </div>
          <div className={styles.StudyPostIconGroup}>
            <div className={styles.StudyPostIcon}>
              <img src={heart_off} alt="heart_off" />
              <span>123</span>
            </div>
            <div className={styles.StudyPostIcon}>
              <img src={comment} alt="comment" />
              <span>123</span>
            </div>
            <div className={styles.StudyPostIcon}>
              <img src={share} alt="share" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
>>>>>>> jaeho3

export default StudyPost;
