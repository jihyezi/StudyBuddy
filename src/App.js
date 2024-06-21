import { BrowserRouter, Route, Routes } from "react-router-dom";
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
  display: flex;
  flex-direction: row;
  margin-left: 250px; /* 사이드바의 너비만큼 왼쪽 여백 추가 */
  width: calc(100% - 250px); /* 사이드바를 제외한 나머지 너비 설정 */
  height: 100vh;
  overflow: auto; /* 내용이 넘칠 경우 스크롤 가능하도록 설정 */
`;

function App() {
  return (
    <BrowserRouter>
      <Center>
        <Sidebar />
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
        <Recommended />
      </Center>
    </BrowserRouter>
  );
}

export default App;
