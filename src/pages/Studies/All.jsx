import React from "react";
import styles from "./All.module.css";
import Filter from "components/Studies/Filter";

import Search from "assets/icons/Explore/search.png";
import StudyPost from "components/Studies/StudyPost";

const examplePosts = [
    {
        state: "1",
        title: "React 스터디 모집",
        content: "React를 함께 공부할 사람을 모집합니다.",
        tag: ["React", "JavaScript", "프론트엔드"],
        person: 5,
        type: "온라인",
    },
    {
        state: "0",
        title: "Python 스터디 모집 완료",
        content: "Python을 함께 공부할 사람을 모집했습니다.",
        tag: ["Python", "Backend"],
        person: 8,
        type: "오프라인",
    },
    {
        state: "1",
        title: "Python 스터디 모집",
        content: "Python을 함께 공부할 사람을 모집했습니다.",
        tag: ["Python", "Backend"],
        person: 0,
        type: "오프라인",
    },
    {
        state: "0",
        title: "Python 스터디 모집 완료",
        content: "Python을 함께 공부할 사람을 모집했습니다.",
        tag: ["Python", "Backend"],
        person: 20,
        type: "오프라인",
    },
    {
        state: "1",
        title: "Python 스터디 모집",
        content: "Python을 함께 공부할 사람을 모집했습니다.",
        tag: ["Python", "Backend"],
        person: 110,
        type: "온라인",
    },
    {
        state: "0",
        title: "Python 스터디 모집",
        content: "Python을 함께 공부할 사람을 모집했습니다.",
        tag: ["Python", "Backend"],
        person: 1467,
        type: "온라인",
    },
];

const All = () => {
    return (
        <div>
            <div className={styles.filter}>
                <Filter placeholder={"전체"} />
                <div className={styles.searchinputfiled}>
                    <div className={styles.InputWrapper}>
                        <input
                            type="text"
                            className={styles.SearchInput}
                            placeholder="스터디를 검색해보세요."
                        />
                        <img src={Search} alt="Search" className={styles.SearchIcon} />
                    </div>
                    <button className={styles.SearchButton}>
                        Search
                    </button>
                </div>
            </div>
            {examplePosts.map((post, index) => (
                <StudyPost
                    key={index}
                    state={post.state}
                    title={post.title}
                    content={post.content}
                    tag={post.tag}
                    person={post.person}
                    type={post.type}
                />
            ))}

        </div>
    )
}

export default All;