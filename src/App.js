import React, { useEffect, useState } from "react";
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
import StudyPost from "pages/Post/StudyPost";
import Recommended from "pages/Recommended/Recommended";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vrpwhfbfzqwmqlhwhbtu.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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
  const location = useLocation(); // 현재 경로를 가져옴

  return (
    <>
      <Content>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/communities" element={<Communities />} />
          <Route path="/studies" element={<Studies />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/post" element={<Post />} />
          <Route path="/community-details" element={<CommunityDetailsPage />} />
          <Route path="/study-post" element={<StudyPost />} />
        </Routes>
      </Content>
      {(location.pathname === "/communities" ||
        location.pathname === "/community-details") && <Recommended />}
    </>
  );
};

function App() {
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

  // 상태 전환 함수
  const toggleNotifications = () => {
    setShowNotifications((prevShowNotifications) => {
      const newState = !prevShowNotifications;
      return newState;
    });
  };

  return (
    <BrowserRouter>
      <Sidebar toggleNotifications={toggleNotifications} />
      <Center>
        <MainContent />
        <Notifications showNotifications={showNotifications} />
      </Center>
    </BrowserRouter>
  );
}

export default App;
