import React, { useEffect, useState } from "react";
import styles from "./All.module.css";
import Filter from "components/Studies/Filter";
import Search from "assets/icons/Explore/search.png";
import StudyPost from "components/Studies/StudyPost";
import supabase from "components/supabaseClient";

const All = () => {
  const [posts, setPosts] = useState([]);
  const [likesCount, setLikesCount] = useState({});
  const [commentsCount, setCommentsCount] = useState({});
  const [selectOption, setSelectOption] = useState('전체');

  const handleSelectOption = (option) => {
    setSelectOption(option);
  }

  const fetchStudyDataAll = async () => {
    const { data, error } = await supabase.from("Study").select("*");

    if (error) {
      console.error("Error fetching data:", error);
    } else {
      await fetchLikesCount();
      await fetchCommentsCount();
      setPosts(data);
    }
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
  }, [selectOption]);

  const filterPosts = posts.filter((p) =>
    selectOption === '전체' ? true : p.completion === selectOption
  );

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
            />
            <img src={Search} alt="Search" className={styles.SearchIcon} />
          </div>
          <button className={styles.SearchButton}>Search</button>
        </div>
      </div>
      {filterPosts.map((post, index) => (
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
      ))}
    </div>
  );
};

export default All;
