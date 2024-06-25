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
  height: 100vh;
  display: flex;
  flex-direction: row;
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
        {/* <Recommended /> Home 에서는 사용 x*/}
      </Center>
    </BrowserRouter>
  );
}

export default App;
