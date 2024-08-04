import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import styled from "styled-components";
import Sidebar from "components/Sidebar/Sidebar";
import Home from "pages/Home/Home";
import Explore from "pages/Explore/Explore";
import Communities from "pages/Communities/Communities";
import Studies from "pages/Studies/Studies";
import Notifications from "pages/Notifications/Notifications";
import Messages from "pages/Messages/Messages";
import Bookmarks from "pages/Bookmarks/Bookmarks";
import Profile from "pages/Profile/Profile";
import Post from "pages/Post/Post";
import CommunityDetailsPage from "pages/Communities/CommunityDetailsPage";
import Recommended from "pages/Recommended/Recommended";
import CommunityPost from "pages/Post/CommunityPost";
import StudyPost from "pages/Post/StudyPost";
import LoginModal from "components/Home/LoginModal";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import supabase from "components/supabaseClient";

const Center = styled.div`
  margin-left: 20%; /* 사이드바의 너비만큼 마진을 추가하여 겹치지 않도록 함 */
  width: 80%;
  height: 100vh;
  display: flex;
  flex-direction: row;
`;

const Content = styled.div`
  flex: 1; /* 차지할 수 있는 모든 공간을 차지하도록 설정 */
`;

const MainContent = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);

  useEffect(() => {
    if (!user && location.pathname === "/profile") {
      setLoginModalIsOpen(true);
    } else {
      setLoginModalIsOpen(false);
    }
  }, [user, location.pathname]);

  const closeLoginModal = () => setLoginModalIsOpen(false);

  return (
    <>
      <Content>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/communities" element={<Communities />} />
          <Route path="/studies" element={<Studies />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-post" element={<Post />} />
          <Route path="/create-community" element={<CommunityPost />} />
          <Route path="/create-study" element={<StudyPost />} />
          <Route
            path="/CommunityDetailsPage"
            element={<CommunityDetailsPage />}
          />
        </Routes>
      </Content>
      {(location.pathname === "/communities" ||
        location.pathname === "/CommunityDetailsPage") && <Recommended />}
      <LoginModal modalIsOpen={loginModalIsOpen} closeModal={closeLoginModal} />
    </>
  );
};

const App = () => {
  const [users, setUsers] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let { data: users, error } = await supabase.from("User").select("*");

        if (error) {
          console.error("Error fetching users:", error);
        } else {
          setUsers(users);
          console.log("User data:", users);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUsers();
  }, []);
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };
  return (
    <BrowserRouter>
      <Sidebar toggleNotifications={toggleNotifications} />
      <Center>
        <MainContent />
        <Notifications
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          toggleNotifications={toggleNotifications}
        />
      </Center>
    </BrowserRouter>
  );
}

export default App;
