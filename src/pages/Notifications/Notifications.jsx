import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import supabase from "components/supabaseClient";
import styles from "./Notifications.module.css";
import noprofile from "assets/images/Profile/noprofile.png";

const fetchUsers = async () => {
  const { data: users, error } = await supabase
    .from("User")
    .select("userid, username, nickname, profileimage");
  if (error) throw new Error(error.message);

  return users.reduce((acc, user) => {
    acc[user.userid] = {
      nickname: user.nickname,
      profileimage: user.profileimage || noprofile,
    };
    return acc;
  }, {});
};

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

const fetchNotifications = async (userId) => {
  const { data: notificationsData, error } = await supabase
    .from("Notification")
    .select("*")
    .eq("userid", userId)
    .order("createdat", { ascending: false });
  if (error) throw new Error(error.message);

  return notificationsData;
};

const Notifications = ({ showNotifications }) => {
  const userId = localStorage.getItem("userId"); // 로컬 스토리지에서 userId 가져오기
  const [notifications, setNotifications] = useState([]);
  const queryClient = useQueryClient();

  const { data: userMap, isLoading: isUserLoading, error: userError } = useQuery({
    queryKey: ["userMap"],
    queryFn: fetchUsers,
    enabled: !!userId,
    staleTime: 1000 * 60 * 10,
  });

  const { data: communityMap, isLoading: isCommunityLoading, error: communityError } = useQuery({
    queryKey: ["communityMap"],
    queryFn: fetchCommunities,
    enabled: !!userId,
    staleTime: 1000 * 60 * 10,
  });

  const { data: notificationsData, isLoading: isNotificationsLoading, error: notificationsError } = useQuery({
    queryKey: ["notifications", userId],
    queryFn: () => fetchNotifications(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    onSuccess: (data) => setNotifications(data),
  });

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("notification_channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "Notification" },
        () => queryClient.invalidateQueries(["notifications", userId])
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [userId, queryClient]);

  if (!userId) return <div>Please log in to view notifications.</div>;

  if (isUserLoading || isCommunityLoading || isNotificationsLoading) {
    return <div>Loading...</div>;
  }

  if (userError || communityError || notificationsError) {
    return <div>Error loading notifications.</div>;
  }

  const groupedNotifications = notificationsData?.reduce((acc, notification) => {
    const notificationDate = new Date(notification.createdat);
    const today = new Date();
    let dateLabel = notificationDate.toLocaleDateString();

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

    let content = notification.content;
    let image = noprofile;

    if (notification.content.startsWith("You have received a new message from")) {
      const senderId = notification.content.split("from ")[1];
      content = `${userMap[senderId]?.nickname || "알 수 없는 유저"}님이 메시지를 보내셨습니다.`;
      image = userMap[senderId]?.profileimage || noprofile;
    } else if (notification.content.startsWith("A new post was created in the community")) {
      const parts = notification.content.split("community ")[1].split(" by ");
      const communityId = parseInt(parts[0], 10);
      const postAuthorId = parts[1];
      const communityName = communityMap[communityId] || "알 수 없는 커뮤니티";
      content = `${userMap[postAuthorId]?.nickname || "알 수 없는 유저"}님이 ${communityName} 커뮤니티에 새 글을 작성하였습니다.`;
      image = userMap[postAuthorId]?.profileimage || noprofile;
    } else if (notification.content.startsWith("Your post was liked by")) {
      const likerId = notification.content.split("by ")[1];
      content = `${userMap[likerId]?.nickname || "알 수 없는 유저"}님이 회원님의 게시물을 좋아합니다.`;
      image = userMap[likerId]?.profileimage || noprofile;
    } else if (notification.content.startsWith("Your post received a new comment from")) {
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
      image,
    });
    return acc;
  }, {});

  const formattedNotifications = Object.entries(groupedNotifications || {}).map(([date, items]) => ({
    date,
    items,
  }));

  return (
    <div
      className={`${styles.notificationsContainer} ${showNotifications ? styles.slideIn : styles.slideOut}`}
    >
      <div className={styles.title}>Notifications</div>
      {formattedNotifications.map((section, index) => (
        <div key={index} className={styles.notificationSection}>
          <div className={styles.date}>{section.date}</div>
          {section.items.length > 0 ? (
            section.items.map((item, idx) => (
              <div key={idx} className={styles.notificationItem}>
                <img
                  src={item.image.startsWith("data:image") ? item.image : item.image || noprofile}
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
            <div className={styles.noNotifications}>No notifications.</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Notifications;