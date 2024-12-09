import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";
import "fonts/Font.css";
import { useAuth } from "contexts/AuthContext";
import { useDataContext } from "api/DataContext";
import SidebarItem from "components/Sidebar/SidebarItem";
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
import nopforile from "assets/images/Profile/noprofile.png";
import LoginModal from "components/Home/LoginModal";
import PostModal from "components/Sidebar/PostModal";

const Sidebar = ({ toggleNotifications, isNotificationsOpen }) => {
  const { user, logout } = useAuth();
  const { userData } = useDataContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [isPostModalOpen, setPostModalOpen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  const openPostModal = () => {
    if (!user) {
      alert("로그인이 필요합니다. 로그인 후 다시 시도해 주세요.");
    } else {
      setPostModalOpen(true);
    }
  };

  const closePostModal = () => {
    setPostModalOpen(false);
  };

  const openLoginModal = () => {
    setLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setLoginModalOpen(false);
  };

  const handleLogout = async () => {
    await logout();

    const currentPath = location.pathname;
    if (
      currentPath === "/create-post" ||
      currentPath === "/create-community" ||
<<<<<<< HEAD
      currentPath === "/create-study" ||
      currentPath.startsWith("/profile")
=======
      currentPath === "/create-study"
>>>>>>> e0d8b202abfa26a4f19529701f2611576d619b6d
    ) {
      navigate("/");
    }
  };

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
        <div className={styles.logoAndLogout}>
          <Link to={"/"}>
            <img className={styles.logo} src={logo} alt="logo" />
          </Link>

          {user ? (
            <Link to="#" onClick={handleLogout} className={styles.logoutLink}>
              로그아웃
            </Link>
          ) : (
            <Link to="#" onClick={openLoginModal} className={styles.logoutLink}>
              로그인
            </Link>
          )}
        </div>

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
                        className={
                          menu.text === "profile" ? styles.profileImg : ""
                        }
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
            to={
              userData
                ? `/profile/${userData.username || "defaultNickname"}`
                : "/profile"
            }
            className={({ isActive }) =>
              isActive ? styles.menuOn : styles.menuOff
            }
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
                    borderRadius: "50%",
                  }}
                  src={
                    userData
                      ? userData.profileimage
                        ? userData.profileimage
                        : nopforile
                      : profile_off
                  }
                  alt="icon"
                />
                <span
                  className={isActive ? styles.menuOn : styles.menuOff}
                  style={{ marginLeft: 20 }}
                >
                  Profile
                </span>
              </div>
            )}
          </NavLink>
        </div>

        <div className={styles.post} onClick={openPostModal}>
          Post
        </div>

        {isPostModalOpen && <PostModal closeModal={closePostModal} />}

        <LoginModal
          modalIsOpen={isLoginModalOpen}
          closeModal={closeLoginModal}
        />
      </div>
    </div>
  );
};

export default Sidebar;
