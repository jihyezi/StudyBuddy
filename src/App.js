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
import CommunityPost from "pages/Post/CommunityPost";
import StudyPost from "pages/Post/StudyPost";
import Recommended from "pages/Recommended/Recommended";

//supabase 데이터 인스톨(차후 수정이나 최적화 가능)
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const supabaseUrl = "https://vrpwhfbfzqwmqlhwhbtu.supabase.co";
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
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
            {/* <Route path="/post" element={<Post />} /> */}
            {/* <Route path="/post" element={<CommunityPost />} /> */}
            <Route path="/post" element={<StudyPost />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
