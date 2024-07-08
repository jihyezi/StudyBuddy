import React, { useState, useEffect } from "react";
import "./Notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchedNotifications = [
      {
        date: "오늘",
        items: [
          {
            user: "Oner",
            action: "님이 회원님의 게시물을 좋아합니다.",
            time: "46분전",
            topic: "정보처리기사",
            avatar: "", // 이미지 경로가 비어 있음
          },
          {
            user: "Keria",
            action: "님이 회원님의 게시물에 댓글을 남겼습니다.",
            time: "1시간전",
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
            time: "1일전",
            topic: "시각디자인기사",
            avatar: "", // 이미지 경로가 비어 있음
          },
          {
            user: "Zeus",
            action: "님이 회원님을 단톡방에 초대했습니다.",
            time: "1일전",
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
    <div className="notifications-container">
      <h1>Notifications</h1>
      {notifications.map((section, index) => (
        <div key={index} className="notification-section">
          <h2>{section.date}</h2>
          {section.items.length > 0 ? (
            section.items.map((item, idx) => (
              <div key={idx} className="notification-item">
                <div className="avatar"></div>
                <div className="notification-text">
                  <span className="user">{item.user}</span>
                  {item.action}
                  <div className="notification-details">
                    <span className="topic">{item.topic}</span> ·{" "}
                    <span className="time">{item.time}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
      ))}
    </div>
  );
};

export default Notifications;
