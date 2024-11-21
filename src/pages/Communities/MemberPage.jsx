import React from "react";
import styles from "./MemberPage.module.css";
import noprofile from "assets/images/Profile/noprofile.png";

const MemberPage = ({ adminData = {}, memberData = {} }) => {

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <div className={styles.title}>Admin</div>
        {adminData.map((user, index) => (
          <div key={index} className={styles.userItem}>
            <img
              src={user.profileimage || noprofile}
              className={styles.profileImage}
              alt="profile"
            />
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
          {memberData.map((user, index) => (
            <div key={index} className={styles.userItem}>
              <img
                src={user.profileimage || noprofile}
                className={styles.profileImage}
                alt="profile"
              />
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
