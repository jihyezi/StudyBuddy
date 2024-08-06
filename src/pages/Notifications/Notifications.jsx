import React, { useState, useEffect } from "react";
import styles from "./Notifications.module.css";

const Notifications = ({ showNotifications }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchedNotifications = [
      {
        date: "오늘",
        items: [
          {
            user: "Oner",
            action: "님이 회원님의 게시물을 좋아합니다.",
            time: "46분 전",
            topic: "정보처리기사",
            avatar: "", // 이미지 경로가 비어 있음
          },
          {
            user: "Keria",
            action: "님이 회원님의 게시물에 댓글을 남겼습니다.",
            time: "1시간 전",
            topic: "TOEIC",
            avatar: "", // 이미지 경로가 비어 있음
          },
        ],
      },
      {
        date: "어제",
        items: [
          {
            user: "시각디자인기사",
            action: "커뮤니티에 새 글이 작성되었습니다.",
            time: "1일 전",
            topic: "시각디자인기사",
            avatar: "", // 이미지 경로가 비어 있음
          },
          {
            user: "Zeus",
            action: "님이 회원님을 단톡방에 초대했습니다.",
            time: "1일 전",
            topic: "Messages",
            avatar: "", // 이미지 경로가 비어 있음
          },
        ],
      },
      {
        date: "이번 주",
        items: [],
      },
    ];
    setNotifications(fetchedNotifications);
  }, []);

  return (
    <div
      className={`${styles.notificationsContainer} ${showNotifications ? styles.slideIn : styles.slideOut}`}
    >
      <div className={styles.title}>Notifications</div>
      {notifications.map((section, index) => (
        <div key={index} className={styles.notificationSection}>
          <div className={styles.date}>{section.date}</div>
          {section.items.length > 0 ? (
            section.items.map((item, idx) => (
              <div key={idx} className={styles.notificationItem}>
                <div className={styles.avatar}></div>
                <div className={styles.notificationText}>
                  <span className={styles.user}>{item.user}</span>
                  <span className={styles.action}> {item.action}</span>
                  <div className={styles.notificationDetails}>
                    <span className={styles.topic}>{item.topic}</span> ·{" "}
                    <span className={styles.time}>{item.time}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noNotifivation}>No notifications.</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Notifications;
