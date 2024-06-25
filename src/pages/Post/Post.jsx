import React, { useEffect, useState, useRef } from "react";
import styles from "./Post.module.css";

// component
import Header from "components/Post/Header";
import InputFile from "components/Post/InputFile";
import InputText from "components/Post/InputText";
import InputSelect from "components/Post/InputSelect";
import InputModal from "components/Post/InputModal";
import InputDate from "components/Post/InputDate";

//icon
import album from "assets/icons/Post/album.png";

const Post = ({}) => {
  return (
    <div>
      <Header title={"Post"} />
      <div className={styles.postContainer}>
        <InputText title={"제목"} placeholder={"제목을 입력해 주세요."} />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <InputDate
            title={"시작날짜"}
            placeholder={"시작날짜를 선택해 주세요."}
          />
          <InputDate
            title={"종료날짜"}
            placeholder={"종료날짜를 선택해 주세요."}
          />
        </div>
        <InputModal title={"책"} placeholder={"책을 입력해 주세요."} />
        <InputModal title={"결과"} placeholder={"결과를 입력해 주세요."} />
        <div className={styles.inputContainer}>
          <div className={styles.inputTitle}>공부방법</div>
          <div className={styles.inputWrapper}>
            <input className={styles.inputField} type="text" />
            <div className={styles.iconWrapper}>
              <img src={album} alt="albumIcon" className={styles.albumIcon} />
            </div>
          </div>
        </div>
        <InputFile title={"자료"} placeholder={"파일을 첨부해 주세요."} />
      </div>
    </div>
  );
};
export default Post;
