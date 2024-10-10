import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import SidebarItem from "components/Sidebar/SidebarItem";
import "fonts/Font.css";
import styles from "./Sidebar.module.css";
import { useAuth } from "contexts/AuthContext"; // useAuth 훅을 가져옵니다.
// Icons
import logo from "assets/icons/Sidebar/studybuddyLogo.png";
import home_off from "assets/icons/Sidebar/home_off.png";
import home_on from "assets/icons/Sidebar/home_on.png";
import explore_off from "assets/icons/Sidebar/explore_off.png";
import explore_on from "assets/icons/Sidebar/explore_on.png";
import communities_off from "assets/icons/Sidebar/communities_off.png";
import communities_on from "assets/icons/Sidebar/communities_on.png";
import studies_off from "assets/icons/Sidebar/studies_off.png";
import studies_on from "assets/icons/Sidebar/studies_on.png";
import notifications_off from "assets/icons/Sidebar/notifications_off.png";
import notifications_on from "assets/icons/Sidebar/notifications_on.png";
import messages_off from "assets/icons/Sidebar/messages_off.png";
import messages_on from "assets/icons/Sidebar/messages_on.png";
import bookmarks_off from "assets/icons/Sidebar/bookmarks_off.png";
import bookmarks_on from "assets/icons/Sidebar/bookmarks_on.png";
import profile_off from "assets/icons/Sidebar/profile_off.png";
import profile_on from "assets/icons/Sidebar/profile_on.png";
import nopforile from 'assets/images/Profile/noprofile.png';

// Sidebar 컴포넌트를 props로 받아오는 toggleNotifications와 함께 정의
const Sidebar = ({ toggleNotifications, isNotificationsOpen, userProfile, loginUser }) => {
  const { user, logout } = useAuth();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  const menus = [
    { name: "Home", path: "/", text: "home" },
    { name: "Explore", path: "/explore", text: "explore" },
    { name: "Communities", path: "/communities", text: "communities" },
    { name: "Studies", path: "/studies", text: "studies" },
    { name: "Notifications", path: "#", text: "notifications" },
    { name: "Messages", path: "/messages", text: "messages" },
    { name: "Bookmarks", path: "/bookmarks", text: "bookmarks" },
  ];

  const iconMapping = {
    home: { off: home_off, on: home_on },
    explore: { off: explore_off, on: explore_on },
    communities: { off: communities_off, on: communities_on },
    studies: { off: studies_off, on: studies_on },
    notifications: { off: notifications_off, on: notifications_on },
    messages: { off: messages_off, on: messages_on },
    bookmarks: { off: bookmarks_off, on: bookmarks_on },
  };

  const handlePostClick = () => {
    if (!user) {
      alert("로그인이 필요합니다. 로그인 후 다시 시도해 주세요.");
    } else {
      setDropdownVisible(!dropdownVisible);
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.side}>
      <div className={styles.menus}>
        <Link to={"/"}>
          <img className={styles.logo} src={logo} alt="logo" />
        </Link>

        {menus.map((menu, index) => {
          const { off, on } = iconMapping[menu.text];
          return (
            <div className={styles.menu} key={index}>
              {menu.text === "notifications" ? (
                <div
                  className={styles.menuItem}
                  onClick={toggleNotifications}
                  style={{
                    color: "#333333",
                    textDecoration: "none",
                    verticalAlign: "middle",
                    cursor: "pointer",
                    fontFamily: "BalooTammudu2-Regular",
                    fontSize: 20,
                  }}
                >
                  <img
                    style={{
                      width: 24,
                      height: 24,
                      verticalAlign: "middle",
                    }}
                    src={isNotificationsOpen ? on : off}
                    alt="icon"
                  />
                  <SidebarItem menu={menu} />
                </div>
              ) : (
                <NavLink
                  to={menu.path}
                  key={index}
                  style={{
                    color: "#333333",
                    textDecoration: "none",
                    verticalAlign: "middle",
                  }}
                  className={({ isActive }) =>
                    isActive ? styles.menuOn : styles.menuOff
                  }
                  onClick={() => {
                    if (isNotificationsOpen) toggleNotifications();
                  }}
                >
                  {({ isActive }) => (
                    <>
                      <img
                        className={menu.text === "profile" ? styles.profileImg : ""}
                        style={{
                          width: 24,
                          height: 24,
                          verticalAlign: "middle",
                        }}
                        src={isActive ? on : off}
                        alt="icon"
                      />
                      <SidebarItem menu={menu} />
                    </>
                  )}
                </NavLink>
              )}
            </div>
          );
        })}

        <div className={styles.menu}>
          <NavLink
            to={"/profile"}
            className={({ isActive }) => (isActive ? styles.menuOn : styles.menuOff)}
          >
            {({ isActive }) => (
              <div
                className={styles.menuItem}
                style={{
                  color: "#333333",
                  textDecoration: "none",
                  verticalAlign: "middle",
                  cursor: "pointer",
                  fontFamily: "BalooTammudu2-Regular",
                  fontSize: 20,
                }}
              >
                <img
                  style={{
                    width: 24,
                    height: 24,
                    verticalAlign: "middle",
                    borderRadius: '50%',
                  }}
                  src={
                    loginUser // 로그인한 경우
                      ? loginUser.profileimage // 프로필 이미지가 있으면 프로필 이미지
                        ? loginUser.profileimage
                        : nopforile // 프로필 이미지가 없으면 nopforile
                      : profile_off // 로그인하지 않은 경우 profile_off
                  }
                  alt="icon"
                />
                <span className={isActive ? styles.menuOn : styles.menuOff} style={{ marginLeft: 20 }}>
                  Profile
                </span>
              </div>
            )}
          </NavLink>
        </div>



        <div
          className={styles.post}
          onClick={handlePostClick}
          ref={dropdownRef}
        >
          Post
          {dropdownVisible && (
            <div className={styles.dropdown}>
              <Link to="/create-post" className={styles.dropdownItem}>
                게시물 작성
              </Link>
              <Link to="/create-community" className={styles.dropdownItem}>
                커뮤니티 개설
              </Link>
              <Link to="/create-study" className={styles.dropdownItem}>
                스터디 생성
              </Link>
            </div>
          )}
        </div>
        {user && (
          <button
            className={styles.logoutButton}
            onClick={logout}
            style={{
              marginTop: "auto",
              backgroundColor: "#f00",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              display: "block",
              width: "100%",
              textAlign: "center",
            }}
          >
            로그아웃(임시)
          </button>
        )}
      </div>
    </div>
  );
};
export default Sidebar;
