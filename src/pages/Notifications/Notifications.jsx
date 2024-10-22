import React, { useState, useEffect } from "react";
import { useAuth } from "contexts/AuthContext";  // AuthContext에서 인증된 유저 정보 가져오기
import supabase from "components/supabaseClient";
import styles from "./Notifications.module.css";
import noprofile from "assets/images/Profile/noprofile.png";

const Notifications = ({ showNotifications }) => {
  const { user } = useAuth();  // 현재 로그인된 유저 정보 가져오기
  const [notifications, setNotifications] = useState([]);
  const [userMap, setUserMap] = useState({}); // UUID와 username 매핑
  const [publicUser, setPublicUser] = useState(null); // 현재 로그인된 유저의 Public 스키마 정보

  // 유저 정보를 불러와 UUID와 username 매핑
  const fetchUsers = async () => {
    const { data: users, error } = await supabase.from("User").select("userid, username, nickname, profileimage");
    if (error) {
      console.error("Error fetching users:", error.message);
    } else {
      const userMapping = users.reduce((acc, user) => {
        // UUID를 키로 하고, 유저 이름을 값으로 저장
        acc[user.userid] = {
          nickname: user.nickname,
          profileimage: user.profileimage || noprofile
        };
        return acc;
      }, {});
      setUserMap(userMapping); // 상태에 저장
    }
  };

  useEffect(() => {
    const fetchPublicUser = async () => {
      if (user) {  // 로그인 여부 확인
        // 현재 로그인한 유저의 Public 스키마 정보 설정
        const { data: currentUserData, error: currentUserError } = await supabase
          .from("User")
          .select("userid")
          .eq("email", user.email)
          .single();

        if (currentUserError) {
          console.error("Error fetching current user:", currentUserError.message);
        } else {
          setPublicUser(currentUserData); // Public 유저 정보 설정
        }
      }
    };

    const fetchNotifications = async () => {
      if (publicUser) {
        // Notification 테이블에서 현재 유저에게 온 알림만 가져오기
        const { data: notificationsData, error } = await supabase
          .from("Notification")
          .select("*")
          .eq("userid", publicUser.userid)  // 현재 유저에게 온 알림만 필터링
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

            // 알림 내용 포맷 처리
            let content = notification.content;
            let image = noprofile;

            // 메시지 수신 알림 처리
            if (notification.content.startsWith("You have received a new message from")) {
              const senderId = notification.content.split("from ")[1];
              content = `${userMap[senderId]?.nickname || "알 수 없는 유저"}님이 메시지를 보내셨습니다.`;
              image = userMap[senderId]?.profileimage || noprofile;  // 프로필 이미지 설정
            }
            // 커뮤니티에 새 글 알림 처리
            else if (notification.content.startsWith("A new post has been created in the community")) {
              const parts = notification.content.split("by ");
              const postAuthorId = parts[1];
              content = `${userMap[postAuthorId]?.nickname || "알 수 없는 유저"}님이 커뮤니티에 새 글을 작성하였습니다.`;
              image = userMap[postAuthorId]?.profileimage || noprofile;
            }
            // 내가 쓴 글에 좋아요를 눌렀을 때
            else if (notification.content.startsWith("Your post was liked by")) {
              const likerId = notification.content.split("by ")[1];
              content = `${userMap[likerId]?.nickname || "알 수 없는 유저"}님이 회원님의 게시물을 좋아합니다.`;
              image = userMap[likerId]?.profileimage || noprofile;
            }
            // 내가 쓴 글에 댓글을 남겼을 때
            else if (notification.content.startsWith("Your post received a new comment from")) {
              const commenterId = notification.content.split("from ")[1];
              content = `${userMap[commenterId]?.nickname || "알 수 없는 유저"}님이 댓글을 남겼습니다.`;
              image = userMap[commenterId]?.profileimage || noprofile;
            }

            if (!acc[dateLabel]) {
              acc[dateLabel] = [];
            }
            acc[dateLabel].push({
              content,
              createdat: notification.createdat,
              image
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
      }
    };

    if (user) {  // 로그인한 경우에만 실행
      fetchUsers(); // 유저 정보 가져오기
      fetchPublicUser(); // 현재 유저의 Public 스키마 정보 가져오기

      // 실시간으로 Notification을 수신하기 위한 리스너 설정
      const channel = supabase
        .channel('notification_channel')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'Notification' },
          (payload) => {
            fetchNotifications(); // 새로운 알림이 도착하면 알림을 업데이트
          }
        )
        .subscribe();

      return () => {
        channel.unsubscribe(); // 구독 취소
      };
    }
  }, [user, publicUser]);

  if (!user) {
    return null;  // 로그인이 안되어 있으면 아무것도 렌더링하지 않음
  }

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
                <img
                  src={item.image.startsWith('data:image') ? item.image : item.image || noprofile}
                  className={styles.avatar}
                  alt="Profile Image"
                />
                <div className={styles.notificationText}>
                  <span className={styles.action}> {item.content}</span>
                  <div className={styles.notificationDetails}>
                    <span className={styles.time}>
                      {new Date(item.createdat).toLocaleTimeString([], { hour12: false })}
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
