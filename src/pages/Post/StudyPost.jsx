import React, { useRef } from "react";
import styles from "./StudyPost.module.css";

// component
import Header from "components/Post/Header";
import InputText from "components/Post/InputText";
import InputSelect from "components/Post/InputSelect";
import InputModal from "components/Post/InputModal";

//icon
import album from "assets/icons/Post/album.png";
import file from "assets/icons/Post/file_white.png";

const StudyPost = () => {
  const editorRef = useRef(null);

  const handleAlbumClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.src = e.target.result;
        img.className = styles.image; // 스타일 추가
        img.contentEditable = false; // 이미지가 편집되지 않도록 설정
        editorRef.current.appendChild(img);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleFileClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = (event) => {
      const file = event.target.files[0];
      console.log("Selected file:", file);
    };
    input.click();
  };

  return (
    <div>
      <Header title={"Studies"} />
      <div className={styles.postContainer}>
        <InputText title={"제목"} placeholder={"제목을 입력해 주세요."} />
        <div style={{ display: "flex", flexDirection: "row" }}>
          <InputSelect title={"진행방식"} placeholder={"온라인/오프라인"} />
          <InputSelect title={"모집인원"} placeholder={"인원 미정~10명 이상"} />
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <InputSelect title={"기간"} placeholder={"기간 미정~6개월 이상"} />
          <InputText title={"일정"} placeholder={"ex) 매주 월요일 1시"} />
        </div>
        <InputModal
          title={"장소"}
          placeholder={"오프라인 스터디 진행 시 장소를 입력해주세요."}
        />
        <div className={styles.inputContainer}>
          <div className={styles.inputTitle}>스터디 소개</div>
          <div className={styles.inputFieldWrapper}>
            <div
              ref={editorRef}
              className={styles.inputField}
              contentEditable
              placeholder="스터디 소개를 입력하세요."
            />
            <div className={styles.albumIconWrapper} onClick={handleAlbumClick}>
              <img className={styles.albumIcon} src={album} alt="albumIcon" />
            </div>
            <div className={styles.fileIconWrapper} onClick={handleFileClick}>
              <img className={styles.fileIcon} src={file} alt="fileIcon" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPost;
