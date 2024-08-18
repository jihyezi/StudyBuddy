import React, { useState, useEffect } from "react";
import styles from "./DMList.module.css";
import DMChat from "./DMChat";
import DMSend from "./DMSend";
import SendMessageIcon from "assets/icons/Messages/SendMessage.png";
import profile from 'assets/images/faker2.jpg'
import profile2 from 'assets/images/gromit.jpeg'
import profile3 from 'assets/images/profile1.png'

const initialDummyData = [
  {
    profile: profile,
    username: "우제",
    id: "godthunderzeus",
    date: "2023.02.04",
    message: "정보 감사합니다💕",
  },
  {
    profile: profile2,
    username: "현준",
    id: "hyunjun123",
    date: "2023.02.05",
    message: "확인했습니다😊",
  },
  {
    profile: profile3,
    username: "Faker(페이커)",
    id: "faker",
    date: "2023.02.06",
    message: "확인했습니다👀",
  },
  {
    profile: profile,
    username: "이민형",
    id: "t1_gumay",
    date: "2023.02.07",
    message: "굿굿! 👍",
  },
  {
    profile: profile2,
    username: "류민석",
    id: "keria_minseok",
    date: "2023.02.08",
    message: "알려줘서 고마워요! 🙌",
  },
  {
    profile: profile3,
    username: "김강희",
    id: "t1_roach",
    date: "2023.02.09",
    message: "너무 아쉽네요 😢",
  },
  {
    profile: profile,
    username: "임재현",
    id: "lol_tom123",
    date: "2023.02.10",
    message: "확인했습니다! 👌",
  },
];


function DMList() {
  const { user, loading } = useAuth(); // 인증 상태와 로딩 상태를 가져옴
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [chatUsers, setChatUsers] = useState([]); // 대화 사용자 데이터를 저장할 상태
  const [error, setError] = useState(null); // 오류를 저장할 상태

  useEffect(() => {
    if (!loading) { // 로딩 상태가 끝난 후 처리
      if (!user) {
        setLoginModalIsOpen(true); // 사용자가 로그인되지 않은 경우 로그인 모달 열기
      } else {
        fetchChatUsers(); // 로그인된 경우 대화 사용자 정보 가져오기
      }
    }
  }, [user, loading]);

  // 대화 사용자 정보를 가져오는 함수
  const fetchChatUsers = async () => {
    try {
      if (!user || !user.userid) {
        console.error("User ID is not available");
        return;
      }

      // DirectMessage 테이블에서 사용자와 관련된 대화 정보를 가져옴
      const { data, error } = await supabase
        .from("DirectMessage") // 테이블 이름 확인
        .select("senderid, receiverid")
        .or(`senderid.eq.${user.userid},receiverid.eq.${user.userid}`);

      if (error) {
        console.error("Error fetching chat users:", error);
        setError("대화 사용자 정보를 가져오는 데 실패했습니다.");
        return;
      }

      // 고유한 사용자 ID 추출
      const uniqueUserIds = [
        ...new Set(
          data.map((dm) =>
            dm.senderid === user.userid ? dm.receiverid : dm.senderid
          )
        ),
      ];

      if (uniqueUserIds.length === 0) {
        setChatUsers([]); // 대화할 사용자가 없는 경우
        return;
      }

      // 고유한 사용자 ID로 사용자 정보를 가져옴
      const { data: usersData, error: userError } = await supabase
        .from("User") // 테이블 이름 확인
        .select("userid, username, nickname, profileimage")
        .in("userid", uniqueUserIds);

      if (userError) {
        console.error("Error fetching user data:", userError);
        setError("사용자 데이터를 가져오는 데 실패했습니다.");
        return;
      }

      setChatUsers(usersData);
    } catch (error) {
      console.error("Unexpected error fetching chat users:", error.message);
      setError("예기치 못한 오류가 발생했습니다.");
    }
  };

  // 사용자를 클릭했을 때의 핸들러
  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  // 새 메시지를 작성할 때의 핸들러
  const handleNewMessageClick = () => {
    setIsSending(true);
  };

  // 메시지를 전송할 때의 핸들러
  const handleSendMessage = (user) => {
    setSelectedUser(user);
    setIsSending(false);
  };

  // 로그인 모달 닫기
  const closeLoginModal = () => setLoginModalIsOpen(false);

  return (
    <div className={styles.dmListContainer}>
      <LoginModal modalIsOpen={loginModalIsOpen} closeModal={closeLoginModal} />
      <div className={styles.modal}>
        <div className={styles.header}>Messages</div>
        <div className={styles.messageList}>
          {error && <p className={styles.error}>{error}</p>} {/* 오류 메시지 표시 */}
          {chatUsers.map((user, index) => (
            <div
              className={`${styles.messageItem} ${selectedUser && selectedUser.id === message.id
                ? styles.selected
                : ""
                }`}

              key={index}
              onClick={() => handleUserClick(user)}
            >
              <img src={message.profile} className={styles.profileImage} />

              <div className={styles.messageContent}>
                <div className={styles.messageHeader}>
                  <span className={styles.username}>{user.nickname}</span>
                  <span className={styles.id}>@{user.username}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedUser ? (
        <DMChat selectedUser={selectedUser} />
      ) : (
        <div className={styles.noChat} onClick={handleNewMessageClick}>
          <img
            src={SendMessageIcon}
            alt="New Message"
            className={styles.newMessageIcon}
          />
          <div className={styles.newMessageText}>New Message</div>
        </div>
      )}
      {isSending && (
        <DMSend
          setIsSending={setIsSending}
          setSelectedUser={handleSendMessage}
        />
      )}
    </div>
  );
}

export default DMList;
