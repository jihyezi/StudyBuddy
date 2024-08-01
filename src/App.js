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

//Post
import Post from "pages/Post/Post";
<<<<<<< HEAD
import CommunityPost from "pages/Post/CommunityPost";
import StudyPost from "pages/Post/StudyPost";

//DetailPost
import DetailPost from "pages/Post/DetailPost";
import DetailStudyPost from "pages/Studies/DetailStudyPost";

import Recommended from "pages/Recommended/Recommended";
import CommunityDetailsPage from "pages/Communities/CommunityDetailsPage";

//supabase 데이터 인스톨(차후 수정이나 최적화 가능)
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const supabaseUrl = "https://vrpwhfbfzqwmqlhwhbtu.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);
=======
import CommunityDetailsPage from "pages/Communities/CommunityDetailsPage";
import Recommended from "pages/Recommended/Recommended";
import StudyPost from "pages/Post/StudyPost";
import LoginModal from "components/Home/LoginModal"; // 로그인 모달 컴포넌트
import { AuthProvider, useAuth } from "./contexts/AuthContext"; // 인증 컨텍스트
import supabase from "components/supabaseClient"; // supabase 클라이언트
>>>>>>> 8c15273007a325a276d3ff43d0975903f493ece5

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
          <Route path="/studies" element={<DetailPost />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/profile" element={<Profile />} />
<<<<<<< HEAD
          <Route path="/create-post" element={<Post />} />
          <Route path="/create-community" element={<CommunityPost />} />
          <Route path="/create-study" element={<StudyPost />} />
=======
          <Route path="/post" element={<Post />} />
>>>>>>> 8c15273007a325a276d3ff43d0975903f493ece5
          <Route
            path="/CommunityDetailsPage"
            element={<CommunityDetailsPage />}
          />
<<<<<<< HEAD
=======
          <Route path="/post" element={<StudyPost />} />
>>>>>>> 8c15273007a325a276d3ff43d0975903f493ece5
        </Routes>
      </Content>
      {(location.pathname === "/communities" ||
        location.pathname === "/CommunityDetailsPage") && <Recommended />}
<<<<<<< HEAD
=======
      <LoginModal modalIsOpen={loginModalIsOpen} closeModal={closeLoginModal} />
>>>>>>> 8c15273007a325a276d3ff43d0975903f493ece5
    </>
  );
};

const App = () => {
  const [users, setUsers] = useState([]);

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

  return (
    <AuthProvider>
      <BrowserRouter>
        <Sidebar />
        <Center>
          <MainContent />
        </Center>
      </BrowserRouter>
    </AuthProvider>
  );
<<<<<<< HEAD
}
=======
};
>>>>>>> 8c15273007a325a276d3ff43d0975903f493ece5

export default App;
