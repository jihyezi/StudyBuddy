import React, { useEffect, useState, useRef } from "react";
import styles from "./CommunityPost.module.css";

// component
import Header from "components/Post/Header";
import InputFile from "components/Post/InputFile";
import InputText from "components/Post/InputText";
import InputSelect from "components/Post/InputSelect";
import InputRule from "components/Post/InputRule";

const CommunityPost = (props) => {
  return (
    <div>
      <Header title={"Communities"} />
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
        <InputRule title={"규칙"} />
      </div>
    </div>
  );
};
export default CommunityPost;
