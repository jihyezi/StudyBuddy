import React from "react";
import styles from './MemberPage.module.css';
import profile from 'assets/images/profile1.png';

const dummydata = [
    {
        nickname: '제우스',
        id: '@godthunderzeus',
        profile: profile,
        role: 'admin'
    },
    {
        nickname: '오너',
        id: '@t1_oner',
        profile: profile,
        role: 'member'
    },
    {
        nickname: '페이커',
        id: '@Faker',
        profile: profile,
        role: 'member'
    },
    {
        nickname: '구마유시',
        id: '@t1_gumayusi',
        profile: profile,
        role: 'member'
    },
    {
        nickname: '케리아',
        id: '@keria_minseok',
        profile: profile,
        role: 'member'
    },
];

const MemberPage = ({ communityData, joinCommunityData, userData, allJoinCommunityData }) => {

    const admin = Array.isArray(userData)
        ? userData.find((u) => u.userid === joinCommunityData.createdby)
        : { nickname: "Unknown nickname", username: "Unknown", profileimage: profile };

    const adminName = admin?.nickname;
    const adminId = admin?.username;
    const adminProfile = admin?.profileimage;

    console.log(allJoinCommunityData)

    const members = allJoinCommunityData
        .filter((join) => join.communityid === joinCommunityData.id) // 해당 커뮤니티에 가입한 모든 유저의 communityid와 비교
        .map((join) => {
            const member = userData.find((u) => u.userid === join.userid);
            return {
                nickname: member?.nickname || "Unknown nickname",
                username: member?.username || "Unknown username",
                profileimage: member?.profileimage || profile,
            };
        });


    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <div className={styles.title}>Admin</div>
                <div className={styles.userItem}>
                    <img src={adminProfile} className={styles.profileImage} alt="profile" />
                    <div className={styles.userInfo}>
                        <span className={styles.nickname}>{adminName}</span>
                        <span className={styles.userId}>@{adminId}</span>
                    </div>
                </div>
            </div>
            <div className={styles.section}>
                <div className={styles.title}>Members</div>
                <div className={styles.userList}>
                    {members.map((user, index) => (
                        <div key={index} className={styles.userItem}>
                            <img src={user.profile} className={styles.profileImage} alt="profile" />
                            <div className={styles.userInfo}>
                                <span className={styles.nickname}>{user.nickname}</span>
                                <span className={styles.userId}>{user.id}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MemberPage;
