import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DataProvider, useDataContext } from "api/DataContext";
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
import ReviseCommunity from "pages/Post/ReviseCommunity";
import SearchResults from "pages/Explore/SearchResulus";
import LoginModal from "components/Home/LoginModal";
import CommonLayout from "components/Explore/CommonLayout";
import BookmarkDetail from "pages/Bookmarks/BookmarkDetail";
import OtherProfile from "pages/Profile/OtherProfile";
import AddCommunity from "pages/Communities/AddCommunity";

const Body = styled.div`
  width: 100%;
  max-width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
`;

const Content = styled.div`
  width: 100%;
  max-width: 1600px;
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
const queryClient = new QueryClient();

const MainContent = ({ loginuser }) => {
  const location = useLocation();
  const { user } = useAuth();
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
  const { userData, allUserData, communityData, postData, refetchUserData, isLoading, hasError, refetchCommunityData } = useDataContext();
  useEffect(() => {
    if (
      !user &&
      (location.pathname === "/profile" || location.pathname === "/bookmarks")
    ) {
      setLoginModalIsOpen(true);
    } else {
      setLoginModalIsOpen(false);
    }
  }, [user, location.pathname]);

  // 경로가 변경될 때마다 데이터를 새로 불러오도록 useEffect 설정
  useEffect(() => {
    refetchCommunityData();
  }, [user, location.pathname]); // 경로 변경 시마다 실행

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
        <Route path="/communities" element={<Communities userData={userData} allUserData={allUserData} communityData={communityData} postData={postData} refetchUserData={refetchUserData} isLoading={isLoading} />} />
        <Route path="/studies" element={<Studies />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/bookmarks" element={<Bookmarks userData={userData} allUserData={allUserData} communityData={communityData} postData={postData} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/other-profile/:userId" element={<OtherProfile />} />
        <Route path="/create-post" element={<Post />} />
        <Route path="/detail-post/:postId" element={<DetailPost />} />
        <Route path="/create-community" element={<CommunityPost />} />
        <Route path="/create-study" element={<StudyPost />} />
        <Route path="/detail-study/:studyId" element={<DetailStudyPost />} />
        <Route path="/revisepost" element={<RevisePost />} />
        <Route path="/revisecommunity" element={<ReviseCommunity />} />
        <Route
          path="/detail-community/:communityId"
          element={<CommunityDetailsPage communityData={communityData} />}
        />
        <Route
          path="/bookmarkdetail/:communityid"
          element={<BookmarkDetail />}
        />
        <Route path="/detailpost" element={<DetailPost />} />
        <Route path="/addCommunity" element={<AddCommunity />} />
      </Routes>
      <LoginModal modalIsOpen={loginModalIsOpen} closeModal={closeLoginModal} />
      {(location.pathname === "/communities" ||
        location.pathname === "/CommunityDetailsPage" ||
        location.pathname === "/bookmarks" ||
        location.pathname === "/studies" ||
        location.pathname.startsWith("/bookmarkdetail/") ||
        location.pathname === "/addCommunity") && <Recommended user={loginuser} userData={userData} allUserData={allUserData} communityData={communityData} postData={postData} />}
      <LoginModal modalIsOpen={loginModalIsOpen} closeModal={closeLoginModal} />
    </>
  );
};

const App = () => {
  const [loginUser, setLoginUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user: sessionUser } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (sessionUser) {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        if (sessionError) {
          console.error("Error getting session:", sessionError);
          return;
        }

        const userId = session.user.id;

        const { data, error } = await supabase
          .from("User")
          .select("*")
          .eq("userid", userId);

        if (error) {
          console.error("Error", error);
        } else {
          setLoginUser(data[0]);
        }
      }
    };

    fetchUserData();
  }, [sessionUser]);

  // 상태 전환 함수
  const toggleNotifications = () => {
    setShowNotifications((prevShowNotifications) => !prevShowNotifications);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <Body>
              <Content>
                <Sidebar
                  toggleNotifications={toggleNotifications}
                  loginUser={loginUser}
                />
                <Center>
                  <MainContent loginuser={loginUser} />
                  <Notifications
                    showNotifications={showNotifications}
                    setShowNotifications={setShowNotifications}
                    toggleNotifications={toggleNotifications}
                  />
                </Center>
              </Content>
            </Body>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
