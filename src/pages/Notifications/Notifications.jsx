import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import supabase from "components/supabaseClient";
import styles from "./Notifications.module.css";
import noprofile from "assets/images/Profile/noprofile.png";

// 유저 데이터 Fetch
const fetchUsers = async () => {
  const { data: users, error } = await supabase
    .from("User")
    .select("userid, username, nickname, profileimage");
  if (error) throw new Error(error.message);

  return users.reduce((acc, user) => {
    acc[user.userid] = {
      nickname: user.nickname || user.username || "Unknown User", // nickname 기본값 설정
      profileimage: user.profileimage || noprofile, // profileimage 기본값 설정
    };
    return acc;
  }, {});
};

// 커뮤니티 데이터 Fetch
const fetchCommunities = async () => {
  const { data: communities, error } = await supabase
    .from("Community")
    .select("communityid, name");
  if (error) throw new Error(error.message);

  return communities.reduce((acc, community) => {
    acc[community.communityid] = community.name;
    return acc;
  }, {});
};

// 알림 데이터 Fetch
const fetchNotifications = async (userId) => {
  if (!userId) return [];
  const { data: notificationsData, error } = await supabase
    .from("Notification")
    .select("*")
    .eq("userid", userId)
    .order("createdat", { ascending: false });
  if (error) throw new Error(error.message);

  return notificationsData;
};

// 메인 컴포넌트
const Notifications = ({ showNotifications }) => {
  const userId = localStorage.getItem("userId");
  const [formattedNotifications, setFormattedNotifications] = useState([]);
  const queryClient = useQueryClient();

  // useQuery hooks
  const { data: userMap, isLoading: isUserLoading } = useQuery({
    queryKey: ["userMap"],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 10,
  });

  const { data: communityMap, isLoading: isCommunityLoading } = useQuery({
    queryKey: ["communityMap"],
    queryFn: fetchCommunities,
    staleTime: 1000 * 60 * 10,
  });

  const { data: notificationsData, isLoading: isNotificationsLoading } = useQuery({
    queryKey: ["notifications", userId],
    queryFn: () => fetchNotifications(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  // 실시간 알림 구독 및 데이터 처리
  useEffect(() => {
    if (!userId || !notificationsData || !userMap || !communityMap) return;

    const channel = supabase
      .channel("notification_channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "Notification" },
        () => queryClient.invalidateQueries(["notifications", userId])
      )
      .subscribe();

    const grouped = notificationsData.reduce((acc, notification) => {
      const notificationDate = new Date(notification.createdat);
      const correctedDate = new Date(notificationDate.getTime() + 9 * 60 * 60 * 1000); // UTC +9 보정
      const today = new Date();
      const correctedToday = new Date(today.getTime() + 9 * 60 * 60 * 1000);

      let dateLabel = correctedDate.toLocaleDateString();

      if (correctedDate.toDateString() === correctedToday.toDateString()) {
        dateLabel = "오늘";
      } else if (
        correctedDate.toDateString() ===
        new Date(correctedToday.setDate(correctedToday.getDate() - 1)).toDateString()
      ) {
        dateLabel = "어제";
      } else if (correctedDate > new Date(correctedToday.setDate(correctedToday.getDate() - 7))) {
        dateLabel = "이번 주";
      }

      let content = notification.content;
      let image = noprofile;

      if (notification.content.startsWith("You have received a new message from")) {
        const senderId = notification.content.split("from ")[1]?.trim();
        const sender = userMap?.[senderId];
        content = `${sender?.nickname || "알 수 없는 유저"}님이 메시지를 보냈습니다.`;
        image = sender?.profileimage || noprofile;
      } else if (notification.content.startsWith("A new post was created in the community")) {
        const parts = notification.content.split("community ")[1]?.split(" by ");
        const communityId = parseInt(parts?.[0], 10);
        const postAuthorId = parts?.[1]?.trim();
        const communityName = communityMap?.[communityId] || "알 수 없는 커뮤니티";
        const author = userMap?.[postAuthorId];
        content = author
          ? `${author.nickname}님이 ${communityName} 커뮤니티에 새 글을 작성하였습니다.`
          : `알 수 없는 유저님이 ${communityName} 커뮤니티에 새 글을 작성하였습니다.`;
        image = author?.profileimage || noprofile;
      } else if (notification.content.startsWith("Your post was liked by")) {
        const likerId = notification.content.split("by ")[1]?.trim();
        const liker = userMap?.[likerId];
        content = liker
          ? `${liker.nickname}님이 회원님의 게시물을 좋아합니다.`
          : "알 수 없는 유저님이 회원님의 게시물을 좋아합니다.";
        image = liker?.profileimage || noprofile;
      } else if (notification.content.startsWith("Your post received a new comment from")) {
        const commenterId = notification.content.split("from ")[1]?.trim();
        const commenter = userMap?.[commenterId];
        content = commenter
          ? `${commenter.nickname}님이 댓글을 남겼습니다.`
          : "알 수 없는 유저님이 댓글을 남겼습니다.";
        image = commenter?.profileimage || noprofile;
      }

      if (!acc[dateLabel]) {
        acc[dateLabel] = [];
      }
      acc[dateLabel].push({
        content,
        createdat: correctedDate.toISOString(),
        image,
      });

      return acc;
    }, {});

    setFormattedNotifications(
      Object.entries(grouped).map(([date, items]) => ({
        date,
        items,
      }))
    );

    return () => {
      channel.unsubscribe();
    };
  }, [userId, notificationsData, userMap, communityMap, queryClient]);

  if (isUserLoading || isCommunityLoading || isNotificationsLoading)
    return <div>Loading...</div>;

  return (
    <div
      className={`${styles.notificationsContainer} ${
        showNotifications ? styles.slideIn : styles.slideOut
      }`}
    >
      <div className={styles.title}>Notifications</div>
      {formattedNotifications.map((section, index) => (
        <div key={index} className={styles.notificationSection}>
          <div className={styles.date}>{section.date}</div>
          {section.items.map((item, idx) => (
            <div key={idx} className={styles.notificationItem}>
              <img
                src={item.image}
                className={styles.avatar}
                alt="Profile"
              />
              <div className={styles.notificationText}>
                <span className={styles.action}>{item.content}</span>
                <div className={styles.notificationDetails}>
                  <span className={styles.time}>
                    {new Date(item.createdat).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Notifications;
