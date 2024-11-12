import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "contexts/AuthContext";
import supabase from "components/supabaseClient";
import styled from "styled-components";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

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
import ReviseStudy from "pages/Post/ReviseStudy";
import SearchResults from "pages/Explore/SearchResulus";
import LoginModal from "components/Home/LoginModal";
import CommonLayout from "components/Explore/CommonLayout";
import BookmarkDetail from "pages/Bookmarks/BookmarkDetail";
import OtherProfile from "pages/Profile/OtherProfile";
import { DataProvider, useDataContext } from "api/DataContext";

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

const fetchBookmarks = async () => {
  const { data, error } = await supabase.from("Bookmark").select("*");
  if (error) throw new Error(error.message);
  return data;
};

const fetchCommunities = async () => {
  const { data, error } = await supabase.from("Community").select("*");
  if (error) throw new Error(error.message);
  return data;
};

const fetchJoinCommunities = async () => {
  const { data, error } = await supabase.from("JoinCommunity").select("*");
  if (error) throw new Error(error.message);
  return data;
};

const fetchPosts = async () => {
  const { data, error } = await supabase.from("Post").select("*");
  if (error) throw new Error(error.message);
  return data;
};

const fetchPostLikes = async () => {
  const { data, error } = await supabase.from("PostLike").select("*");
  if (error) throw new Error(error.message);
  return data;
};

const fetchPostComments = async () => {
  const { data, error } = await supabase.from("Comment").select("*");
  if (error) throw new Error(error.message);
  return data;
};

const fetchStudies = async () => {
  const { data, error } = await supabase.from("Study").select("*");
  if (error) throw new Error(error.message);
  else console.log("fetchStudies", data);
  return data;
};

const fetchStudyLikes = async () => {
  const { data, error } = await supabase.from("StudyLike").select("*");
  if (error) throw new Error(error.message);
  return data;
};

const fetchStudyComments = async () => {
  const { data, error } = await supabase.from("StudyComment").select("*");
  if (error) throw new Error(error.message);
  return data;
};

const fetchUsers = async () => {
  const { data, error } = await supabase.from("User").select("*");
  if (error) throw new Error(error.message);
  return data;
};

const MainContent = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
  const {
    userData,
    allUserData,
    communityData,
    postData,
    studyData,
    refetchUserData,
    isLoading,
    hasError,
  } = useDataContext();

  const { data: bookmarks } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: fetchBookmarks,
  });
  const { data: communities } = useQuery({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });
  const { data: joinCommunities } = useQuery({
    queryKey: ["joinCommunities"],
    queryFn: fetchJoinCommunities,
  });
  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });
  const { data: postLikes } = useQuery({
    queryKey: ["postLikes"],
    queryFn: fetchPostLikes,
  });
  const { data: postComments } = useQuery({
    queryKey: ["postComments"],
    queryFn: fetchPostComments,
  });
  const { data: studies = [] } = useQuery({
    queryKey: ["studies"],
    queryFn: fetchStudies,
  });
  const { data: studyLikes = [] } = useQuery({
    queryKey: ["studyLikes"],
    queryFn: fetchStudyLikes,
  });
  const { data: studyComments = [] } = useQuery({
    queryKey: ["studyComments"],
    queryFn: fetchStudyComments,
  });
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

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
        <Route
          path="/studies"
          element={
            <Studies
              studyData={studyData}
              studyLikes={studyLikes}
              userData={userData}
              allUserData={allUserData}
              isLoading={isLoading}
            />
          }
        />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/other-profile/:userId" element={<OtherProfile />} />
        <Route path="/create-post" element={<Post />} />
        <Route
          path="/detail-post/:postId"
          element={<DetailPost users={users} />}
        />
        <Route path="/create-community" element={<CommunityPost />} />
        <Route
          path="/create-study"
          element={<StudyPost allUserData={allUserData} />}
        />
        <Route
          path="/detail-study/:studyId"
          element={
            <DetailStudyPost
              studyData={studyData}
              studyLikes={studyLikes}
              userData={userData}
              allUserData={allUserData}
              isLoading={isLoading}
            />
          }
        />
        <Route path="/revisepost" element={<RevisePost />} />
        <Route path="/revisecommunity" element={<ReviseCommunity />} />
        <Route
          path="/revise-study/:studyId"
          element={
            <ReviseStudy studyData={studyData} allUserData={allUserData} />
          }
        />
        <Route
          path="/detail-community/:communityId"
          element={<CommunityDetailsPage />}
        />
        <Route
          path="/bookmarkdetail/:communityid"
          element={<BookmarkDetail />}
        />
        <Route path="/detailpost" element={<DetailPost />} />
      </Routes>
      <LoginModal modalIsOpen={loginModalIsOpen} closeModal={closeLoginModal} />
      {(location.pathname === "/communities" ||
        location.pathname === "/CommunityDetailsPage" ||
        location.pathname === "/bookmarks" ||
        location.pathname === "/studies" ||
        location.pathname.startsWith("/bookmarkdetail/")) && <Recommended />}
      <LoginModal modalIsOpen={loginModalIsOpen} closeModal={closeLoginModal} />
    </>
  );
};

const App = () => {
  const queryClient = new QueryClient();

  const [loginUser, setLoginUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user: sessionUser } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("User").select("*");

      if (error) {
        console.error("Error fetching users:", error);
      } else {
        setUsers(data);
        console.log("User data:", data);
      }
    };

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
    fetchUsers();
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
                  <MainContent />
                  {/* <Notifications
                  showNotifications={showNotifications}
                  setShowNotifications={setShowNotifications}
                  toggleNotifications={toggleNotifications}
                /> */}
                </Center>
              </Content>
            </Body>
          </BrowserRouter>
        </DataProvider>{" "}
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
