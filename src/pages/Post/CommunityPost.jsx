import React, { useEffect, useState, useRef } from "react";
import styles from "./CommunityPost.module.css";
import { supabase } from "App";

// component
import Header from "components/Post/Header";
import InputFile from "components/Post/InputFile";
import InputText from "components/Post/InputText";
import InputSelect from "components/Post/InputSelect";
import InputRule from "components/Post/InputRule";

const CommunityPost = (props) => {
  const [file, setFile] = useState(null);

  // const handleFileUpload = async () => {
  //   if (!file) return;

  //   const { data, error } = await supabase.storage
  //     .from('your_bucket_name')
  //     .upload(`public/${file.name}`, file);

  //   if (error) {
  //     console.error("파일 업로드 에러:", error);
  //     return;
  //   }

  //   const { data: postData, error: postError } = await supabase
  //     .from('your_table_name')
  //     .insert([{ file_name: file.name, file_path: data.Key }]);

  //   if (postError) {
  //     console.error("데이터 삽입 에러:", postError);
  //   } else {
  //     console.log("파일 업로드 및 데이터 삽입 성공:", postData);
  //   }
  // };

  const handleFileUpload = () => {
    console.log(file);
  };

  return (
    <div>
      <Header title={"Communities"} onPost={handleFileUpload} />
      <div className={styles.postContainer}>
        <InputFile
          title={"대표 이미지"}
          placeholder={"커뮤니티 대표 이미지를 넣어주세요."}
          onFileSelect={(file) => setFile(file)}
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
