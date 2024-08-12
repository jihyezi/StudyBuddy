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
import BookmarkDetail from "pages/Bookmarks/BookmarkDetail";
import noprofile from "assets/images/Profile/noprofile.png";

const Center = styled.div`
  margin-left: 250px; /* 사이드바의 너비만큼 마진을 추가하여 겹치지 않도록 함 */
  width: calc(100% - 250px);
  height: 100vh;
  display: flex;
  flex-direction: row;
`;

const Content = styled.div`
  flex: 1; /* 차지할 수 있는 모든 공간을 차지하도록 설정 */
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
          <Route path="/create-post" element={<Post />} />
          <Route path="/create-community" element={<CommunityPost />} />
          <Route path="/create-study" element={<StudyPost />} />
          <Route path="/communitydetail" element={<CommunityDetailsPage />} />
          <Route path="/bookmarkdetail" element={<BookmarkDetail />} />
        </Routes>
      </Content>

      <LoginModal modalIsOpen={loginModalIsOpen} closeModal={closeLoginModal} />
      {(location.pathname === "/communities" ||
        location.pathname === "/CommunityDetailsPage" || location.pathname === "/bookmarks" || location.pathname === "/studies") && <Recommended />}
      <LoginModal modalIsOpen={loginModalIsOpen} closeModal={closeLoginModal} />
    </>
  );
};

const App = () => {
  const [users, setUsers] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       let { data: users, error } = await supabase.from("User").select("*");

  //       if (error) {
  //         console.error("Error fetching users:", error);
  //       } else {
  //         setUsers(users);
  //         console.log("User data:", users);
  //       }
  //     } catch (error) {
  //       console.error("Error:", error);
  //     }
  //   };

  //   fetchUsers();
  // }, []);

  const [user, setUser] = useState(null);
  const [imageUrl, setImageUrl] = useState(noprofile);
  const userId = "de25587a-369d-45f5-b5ea-e6abc43d0ab5";

  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from("User")
        .select("bio, birthdate, email, nickname, profileimage, username, backgroundimage")
        .eq("userid", userId)

      if (error) {
        console.error("Error fetching user data:", error);
      } else if (data && data.length > 0) {
        const userData = data[0];
        setUser(userData);

        if (userData.profileimage) {
          const { data: imageUrlData } = supabase
            .storage
            .from('Images')
            .getPublicUrl(`profile/${userData.profileimage}`);

          setImageUrl(imageUrlData.publicUrl);
        } else {
          setImageUrl(noprofile);
        }

      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  console.log(imageUrl + 'app');

  // 상태 전환 함수
  const toggleNotifications = () => {
    setShowNotifications((prevShowNotifications) => !prevShowNotifications);
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <Sidebar toggleNotifications={toggleNotifications} userProfile={imageUrl} />
        <Center>
          <MainContent />
          <Notifications
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            toggleNotifications={toggleNotifications}
          />
        </Center>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;