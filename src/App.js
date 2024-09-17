import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import supabase from "components/supabaseClient";
import styled from "styled-components";

// pages
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
import DetailPost from "pages/Post/DetailPost";
import DetailStudyPost from "pages/Studies/DetailStudyPost";
import RevisePost from "pages/Post/RevisePost";
import SearchResults from "pages/Explore/SearchResulus";
import LoginModal from "components/Home/LoginModal";
import CommonLayout from "components/Explore/CommonLayout";
import BookmarkDetail from "pages/Bookmarks/BookmarkDetail";

const Content = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: row;
`;

const Center = styled.div`
  margin-left: 320px;
  width: calc(100% - 320px);
  display: flex;
  flex-direction: row;
  flex: 1;
`;

const MainContent = () => {
  const location = useLocation();
  const { user } = useAuth(); // useAuth 훅 사용
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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/explore"
          element={
            <CommonLayout>
              <Explore />
            </CommonLayout>
          }
        />
        <Route
          path="/search"
          element={
            <CommonLayout>
              <SearchResults />
            </CommonLayout>
          }
        />
        <Route path="/communities" element={<Communities />} />
        <Route path="/studies" element={<Studies />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-post" element={<Post />} />
        <Route path="/detail-post/:postId" element={<DetailPost />} />
        <Route path="/create-community" element={<CommunityPost />} />
        <Route path="/create-study" element={<StudyPost />} />
        <Route path="/detail-study/:studyId" element={<DetailStudyPost />} />
        <Route path="/revisepost" element={<RevisePost />} />
        <Route
          path="/detail-community/:communityId"
          element={<CommunityDetailsPage />}
        />
        <Route path="/bookmarkdetail" element={<BookmarkDetail />} />
        <Route path="/detailpost" element={<DetailPost />} />
      </Routes>
      <LoginModal modalIsOpen={loginModalIsOpen} closeModal={closeLoginModal} />
      {(location.pathname === "/communities" ||
        location.pathname === "/CommunityDetailsPage" ||
        location.pathname === "/bookmarks" ||
        location.pathname === "/studies") && <Recommended />}
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

  // 상태 전환 함수
  const toggleNotifications = () => {
    setShowNotifications((prevShowNotifications) => !prevShowNotifications);
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <Content>
          <Sidebar toggleNotifications={toggleNotifications} />
          <Center>
            <MainContent />
            <Notifications
              showNotifications={showNotifications}
              setShowNotifications={setShowNotifications}
              toggleNotifications={toggleNotifications}
            />
          </Center>
        </Content>

      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
