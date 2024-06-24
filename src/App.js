import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import styled from "styled-components";

//component
import Sidebar from "components/Sidebar/Sidebar";

//page
import Home from "pages/Home/Home";
import Explore from "pages/Explore/Explore";
import Communities from "pages/Communities/Communities";
import Studies from "pages/Studies/Studies";
import Notifications from "pages/Notifications/Notifications";
import Messages from "pages/Messages/Messages";
import Bookmarks from "pages/Bookmarks/Bookmarks";
import Profile from "pages/Profile/Profile";
import Post from "pages/Post/Post";
import Recommended from "pages/Recommended/Recommended";

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
        </Routes>
      </Content>
      {location.pathname === "/communities" && <Recommended />} {/* 경로가 /communities일 때만 Recommended를 렌더링 */}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Sidebar />
      <Center>
        <MainContent />
      </Center>
    </BrowserRouter>
  );
}

export default App;
