import { BrowserRouter, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import styles from "./App.module.css";

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

function App() {
  return (
    <BrowserRouter>
      <div className={styles.container}>
        <Sidebar />
        <div className={styles.content}>
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
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
