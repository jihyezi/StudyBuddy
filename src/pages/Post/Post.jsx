import React, { useState, useRef } from "react";
import styles from "./Post.module.css";
import { supabase } from "App";

// component
import Header from "components/Post/Header";
import InputFile from "components/Post/InputFile";
import InputText from "components/Post/InputText";
import InputModal from "components/Post/InputModal";
import InputDate from "components/Post/InputDate";

//icon
import album from "assets/icons/Post/album.png";

const Post = () => {
  const [inputTextValue, setInputTextValue] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const editorRef = useRef(null);
  const [file, setFile] = useState(null);

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
        img.className = styles.image;
        img.contentEditable = false;
        editorRef.current.appendChild(img);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  // const handlePost = () => {
  //   console.log("제목:", inputTextValue);
  //   console.log("시작 날짜:", startDate);
  //   console.log("종료 날짜:", endDate);
  // };

  const handlePost = async () => {
    // 데이터 삽입
    const { data, error } = await supabase
      .from("Post") // 테이블 이름
      .insert([
        {
          // title: inputTextValue,
          // start_date: startDate,
          // end_date: endDate,
          postid: 1,
          userid: 2,
          communityid: 1,
          title: inputTextValue,
          content: inputTextValue,
          attachments: [inputTextValue],
          createdat: startDate,
          updatedat: endDate,
        },
      ]);

    if (error) {
      console.error("Error inserting data:", error);
    } else {
      console.log("Data inserted successfully:", data);
    }
  };

  return (
    <div>
      <Header title={"Post"} onPost={handlePost} />
      <div className={styles.postContainer}>
        <InputText
          title={"제목"}
          placeholder={"제목을 입력해 주세요."}
          onChange={(e) => setInputTextValue(e.target.value)} // 입력값 변경 시 상태 업데이트
        />
        <div style={{ display: "flex", flexDirection: "row" }}>
          <InputDate
            title={"시작날짜"}
            placeholder={"시작날짜를 선택해 주세요."}
            onDateChange={setStartDate} // 날짜 변경 핸들러 전달
          />
          <InputDate
            title={"종료날짜"}
            placeholder={"종료날짜를 선택해 주세요."}
            onDateChange={setEndDate} // 날짜 변경 핸들러 전달
          />
        </div>
        <InputModal title={"책"} placeholder={"책을 입력해 주세요."} />
        <InputModal title={"결과"} placeholder={"결과를 입력해 주세요."} />
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
          </div>
        </div>
        <InputFile
          title={"자료"}
          placeholder={"파일을 첨부해 주세요."}
          onFileSelect={(file) => setFile(file)}
        />
      </div>
    </div>
  );
};

export default Post;
