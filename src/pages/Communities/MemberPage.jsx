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

const MemberPage = () => {
    // Filter admin users
    const adminUsers = dummydata.filter(user => user.role === 'admin');

    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <div className={styles.title}>Admin</div>
                {adminUsers.map((user, index) => (
                    <div key={index} className={styles.userItem}>
                        <img src={user.profile} className={styles.profileImage} alt="profile" />
                        <div className={styles.userInfo}>
                            <span className={styles.nickname}>{user.nickname}</span>
                            <span className={styles.userId}>{user.id}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.section}>
                <div className={styles.title}>Members</div>
                <div className={styles.userList}>
                    {dummydata.map((user, index) => (
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
