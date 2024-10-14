import React, { useEffect, useState, useRef } from "react";
import styles from "./All.module.css";
import Filter from "components/Studies/Filter";
import Search from "assets/icons/Explore/search.png";
import StudyPost from "components/Studies/StudyPost";
import supabase from "components/supabaseClient";
import loadinggif from "assets/images/loading.gif"

const Online = () => {
  const [posts, setPosts] = useState([]);
  const [likesCount, setLikesCount] = useState({});
  const [commentsCount, setCommentsCount] = useState({});
  const [searchText, setSearchText] = useState('');
  const [selectOption, setSelectOption] = useState('전체');
  const [loading, setLoading] = useState(true);

  const handleSelectOption = (option) => {
    setSelectOption(option);
  }

  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value);
  }

  const fetchStudyDataAll = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("Study")
      .select("*")
      .eq("proceed", "온라인");

    if (error) {
      console.error("Error fetching data:", error);
    } else {
      await fetchLikesCount();
      await fetchCommentsCount();
      setPosts(data);
    }
    setLoading(false);
  };

  const fetchLikesCount = async () => {
    const { data, error } = await supabase.from("studylikescount").select("*");

    if (error) {
      console.error("Error fetching likes count:", error);
    } else {
      console.log("DATa", data);
      const likesMap = {};
      data.forEach((item) => {
        likesMap[item.studyid] = item.like_count;
      });
      setLikesCount(likesMap);
    }
  };

  const fetchCommentsCount = async () => {
    const { data, error } = await supabase
      .from("studycommentscount")
      .select("*");

    if (error) {
      console.error("Error fetching comments count:", error);
    } else {
      const likesMap = {};
      data.forEach((item) => {
        likesMap[item.studyid] = item.like_count;
      });
      setCommentsCount(likesMap);
    }
  };

  useEffect(() => {
    fetchStudyDataAll();
  }, []);

  return (
    <div className={styles.allContainer}>
      <div className={styles.searchContainer}>
        <div className={styles.filter}>
          <Filter placeholder={"전체"} onOptionSelect={handleSelectOption} />
        </div>
        <div className={styles.searchinputfiled}>
          <div className={styles.InputWrapper}>
            <input
              type="text"
              className={styles.SearchInput}
              placeholder="스터디를 검색해보세요."
              onChange={handleSearchTextChange}
              value={searchText}
            />
            <img src={Search} alt="Search" className={styles.SearchIcon} />
          </div>
        </div>
      </div>
      {loading ? (
        <div style={{ display: 'flex', width: '100%', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
          <img src={loadinggif} style={{ width: '80px' }} alt="Loading" />
        </div>
      ) : (
        posts.map((post, index) => (
          <StudyPost
            key={index}
            studyId={post.studyid}
            completion={post.completion}
            title={post.title}
            description={post.description.split("\n")[0]}
            tag={post.tag}
            maxmembers={post.maxmembers}
            proceed={post.proceed}
            studyPost={post}
            likesCount={likesCount[post.studyid] || 0}
            commentsCount={commentsCount[post.studyid] || 0}
          />
        ))
      )}

    </div>
  );
};

export default Online;
