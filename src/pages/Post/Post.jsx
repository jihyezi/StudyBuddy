import React, { useEffect, useState, useRef } from "react";
import styles from "./Post.module.css";

// component
import Header from "components/Post/Header";
import InputFile from "components/Post/InputFile";
import InputText from "components/Post/InputText";
import InputSelect from "components/Post/InputSelect";
import InputModal from "components/Post/InputModal";
import InputDate from "components/Post/InputDate";

const Post = ({}) => {
  return (
    <div>
      <Header />
      <div className={styles.postContainer}>
        <InputFile
          title={"대표 이미지"}
          placeholder={"커뮤니티 대표 이미지를 넣어주세요."}
        />
        <InputText
          title={"이름"}
          placeholder={"커뮤니티 이름을 입력해주세요."}
        />
        <InputText
          title={"설명"}
          placeholder={"커뮤니티에 대해 간단하게 설명해주세요."}
        />
        <InputSelect title={"분류"} placeholder={"분류를 선택해주세요"} />
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
        <InputFile title={"자료"} placeholder={"파일을 첨부해 주세요."} />
      </div>
    </div>
  );
};
export default Post;
