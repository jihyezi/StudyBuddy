import React, { useEffect, useState, useRef } from "react";
import styles from "./CommunityPost.module.css";
import supabase from "components/supabaseClient";
import { v4 as uuidv4 } from "uuid";

// component
import Header from "components/Post/Header";
import InputFile from "components/Post/InputFile";
import InputImage from "components/Post/InputImage";
import InputText from "components/Post/InputText";
import InputSelect from "components/Post/InputSelect";
import InputRule from "components/Post/InputRule";
import CreateModal from "components/Post/CreateModal";

const CommunityPost = (props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [field, setField] = useState("");
  const [rules, setRules] = useState([]);
  const [file, setFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePostClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleCreateClick = async () => {
    let userId = "";
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log(session.user.id);
      userId = session.user.id;
    });
    if (!file) return;

    const uniqueFileName = `${uuidv4()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("Images")
      // .upload(`community/${file.name}`, file);
      .upload(`community/${uniqueFileName}`, file);

    let url = "";

    if (error) {
      console.error("Error uploading image:", error);
    } else {
      url = supabase.storage.from("Images").getPublicUrl(`${data.path}`)
        .data.publicUrl;
    }

    const { data: postData, error: postError } = await supabase
      .from("Community")
      .insert([
        {
          name: name,
          description: description,
          createdat: new Date(),
          updatedat: new Date(),
          field: field,
          rules: rules,
          createdby: userId,
          image: url,
        },
      ])
      .select();

    if (postError) {
      console.error("데이터 삽입 에러:", postError);
    } else {
      console.log("파일 업로드 및 데이터 삽입 성공:", postData[0].communityid);
    }

    const { data: joinData, error: joinError } = await supabase
      .from("JoinCommunity")
      .insert([
        {
          userid: userId,
          communityid: postData[0].communityid,
          joinedat: new Date(),
          role: "admin",
        },
      ]);

    if (joinError) {
      console.error("데이터 삽입 에러:", joinError);
    } else {
      console.log("데이터 삽입 성공:", joinData);
    }
  };

  return (
    <div>
      <Header title={"Communities"} onPost={handlePostClick} />
      {isModalOpen && (
        <CreateModal onCreate={handleCreateClick} onCancel={handleModalClose} />
      )}
      <div className={styles.postContainer}>
        <InputImage
          title={"대표 이미지"}
          placeholder={"커뮤니티 대표 이미지를 넣어주세요."}
          onFileSelect={(file) => setFile(file)}
        />
        <InputText
          title={"이름"}
          placeholder={"커뮤니티 이름을 입력해주세요."}
          onChange={(e) => setName(e.target.value)}
        />
        <InputText
          title={"설명"}
          placeholder={"커뮤니티에 대해 간단하게 설명해주세요."}
          onChange={(e) => setDescription(e.target.value)}
        />
        <InputSelect
          title={"분류"}
          placeholder={"분류를 선택해주세요"}
          onSelect={setField}
        />
        <InputRule title={"규칙"} onRulesChange={setRules} />
      </div>
    </div>
  );
};

export default CommunityPost;
