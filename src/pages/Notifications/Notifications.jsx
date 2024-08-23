import React, { useState, useEffect } from "react";
import supabase from "components/supabaseClient"; // Supabase 클라이언트 가져오기
import styles from "./Notifications.module.css";

const Notifications = ({ showNotifications }) => {
  const [notifications, setNotifications] = useState([]);
  const [userMap, setUserMap] = useState({}); // UUID와 username 매핑

  // 유저 정보를 불러와 UUID와 username 매핑
  const fetchUsers = async () => {
    const { data: users, error } = await supabase.from("User").select("userid, username");
    if (error) {
      console.error("Error fetching users:", error.message);
    } else {
      const userMapping = users.reduce((acc, user) => {
        acc[user.userid] = user.username; // UUID를 키로 하고, 유저 이름을 값으로 저장
        return acc;
      }, {});
      setUserMap(userMapping); // 상태에 저장
    }
  };

  useEffect(() => {
    fetchUsers(); // 컴포넌트 마운트 시 유저 정보 불러오기

    const fetchNotifications = async () => {
      try {
        // Notification 테이블에서 현재 유저가 받은 알림을 가져오기
        const { data: notificationsData, error } = await supabase
          .from("Notification")
          .select("*")
          .order("createdat", { ascending: false }); // 최신순으로 정렬

        if (error) {
          console.error("Error fetching notifications:", error.message);
        } else {
          // 알림 데이터를 날짜별로 그룹화 및 포맷
          const groupedNotifications = notificationsData.reduce((acc, notification) => {
            const notificationDate = new Date(notification.createdat);
            const today = new Date();
            let dateLabel = notificationDate.toLocaleDateString();

            // 날짜 구분 로직
            if (notificationDate.toDateString() === today.toDateString()) {
              dateLabel = "오늘";
            } else if (
              notificationDate.toDateString() ===
              new Date(today.setDate(today.getDate() - 1)).toDateString()
            ) {
              dateLabel = "어제";
            } else if (notificationDate > new Date(today.setDate(today.getDate() - 7))) {
              dateLabel = "이번 주";
            }

            // 알림 내용 포맷
            const content = notification.content.startsWith("You have received a new message from")
              ? `${userMap[notification.content.split("from ")[1]] || "알 수 없는 유저"}님이 메시지를 보내셨습니다.`
              : notification.content;

            if (!acc[dateLabel]) {
              acc[dateLabel] = [];
            }
            acc[dateLabel].push({
              content,
              createdat: notification.createdat,
            });
            return acc;
          }, {});

          // 데이터를 배열 형태로 변환하여 상태 업데이트
          const formattedNotifications = Object.entries(groupedNotifications).map(([date, items]) => ({
            date, // "오늘", "어제" 등으로 구분된 날짜 라벨
            items,
          }));

          setNotifications(formattedNotifications);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error.message);
      }
    };

    fetchNotifications();

    // 실시간으로 Notification을 수신하기 위한 리스너 설정
    const channel = supabase
      .channel('notification_channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'Notification' },
        (payload) => {
          fetchNotifications(); // 새로운 알림이 도착하면 알림을 업데이트합니다.
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe(); // 구독 취소
    };
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
                  <span className={styles.action}> {item.content}</span>
                  <div className={styles.notificationDetails}>
                    <span className={styles.time}>
                      {new Date(item.createdat).toLocaleTimeString()}
                    </span>
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