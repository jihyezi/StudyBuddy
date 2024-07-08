import React, { useEffect, useState, useRef } from "react";
import styles from "./StudyPost.module.css";

// component
import Header from "components/Post/Header";
import InputFile from "components/Post/InputFile";
import InputText from "components/Post/InputText";
import InputSelect from "components/Post/InputSelect";
import InputModal from "components/Post/InputModal";
import InputDate from "components/Post/InputDate";

//icon
import album from "assets/icons/Post/album.png";
import file from "assets/icons/Post/file_white.png";

const StudyPost = ({}) => {
  return (
    <div>
      <Header title={"Studies"} />
      <div className={styles.postContainer}>
        <InputText title={"제목"} placeholder={"제목을 입력해 주세요."} />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <InputSelect title={"진행방식"} placeholder={"온라인/오프라인"} />
          <InputSelect title={"모집인원"} placeholder={"인원 미정~10명 이상"} />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <InputSelect title={"기간"} placeholder={"기간 미정~6개월 이상"} />
          <InputText title={"일정"} placeholder={"ex) 매주 월요일 1시"} />
        </div>
        <InputModal
          title={"장소"}
          placeholder={"오프라인 스터디 진행 시 장소를 입력해주세요."}
        />
        <div className={styles.inputContainer}>
          <div className={styles.inputTitle}>스터디 소개</div>
          <div className={styles.inputWrapper}>
            <input className={styles.inputField} type="text" />
            <div className={styles.albumIconWrapper}>
              <img className={styles.albumIcon} src={album} alt="albumIcon" />
            </div>
            <div className={styles.fileIconWrapper}>
              <img className={styles.fileIcon} src={file} alt="fileIcon" />
            </div>
          </div>
        </div>
        <InputText title={"태그"} placeholder={"태그를 입력하세요."} />
      </div>
    </div>
  );
};
export default StudyPost;
