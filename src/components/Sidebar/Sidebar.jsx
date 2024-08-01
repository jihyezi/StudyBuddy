import React from "react";
import { Link, NavLink } from "react-router-dom";
import SidebarItem from "components/Sidebar/SidebarItem";
import "fonts/Font.css";
import styles from "./Sidebar.module.css";
import { useAuth } from "../../contexts/AuthContext"; // useAuth 훅
//icons
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

const Sidebar = ({}) => {
  const { user, logout } = useAuth();

  const menus = [
    { name: "Home", path: "/", text: "home" },
    { name: "Explore", path: "/explore", text: "explore" },
    { name: "Communities", path: "/communities", text: "communities" },
    { name: "Studies", path: "/studies", text: "studies" },
    { name: "Notifications", path: "/notifications", text: "notifications" },
    { name: "Messages", path: "/messages", text: "messages" },
    { name: "Bookmarks", path: "/bookmarks", text: "bookmarks" },
    { name: "Profile", path: "/profile", text: "profile" },
  ];

  const iconMapping = {
    home: { off: home_off, on: home_on },
    explore: { off: explore_off, on: explore_on },
    communities: { off: communities_off, on: communities_on },
    studies: { off: studies_off, on: studies_on },
    notifications: { off: notifications_off, on: notifications_on },
    messages: { off: messages_off, on: messages_on },
    bookmarks: { off: bookmarks_off, on: bookmarks_on },
    profile: { off: profile_off, on: profile_on },
  };

  return (
    <div style={{ alignItems: "flex-end" }}>
      <div className={styles.side}>
        <div className={styles.menus}>
          <Link to={"/"}>
            <img className={styles.logo} src={logo} alt="logo" />
          </Link>

          {menus.map((menu, index) => {
            const { off, on } = iconMapping[menu.text];
            return (
              <div className={styles.menu} key={index}>
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
                >
                  {({ isActive }) => (
                    <>
                      <img
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
              </div>
            );
          })}
          <Link to={"/post"} style={{ textDecoration: "none" }}>
            <div className={styles.post}>Post</div>
          </Link>
          {user && (
            <button className={styles.logoutButton} onClick={logout}>
              로그아웃(임시)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
