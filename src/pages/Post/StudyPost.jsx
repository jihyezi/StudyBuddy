import React, { useRef, useState, useEffect } from "react";
import styles from "./StudyPost.module.css";
import supabase from "components/supabaseClient";
import { v4 as uuidv4 } from "uuid";

// component
import Header from "components/Post/Header";
import InputText from "components/Post/InputText";
import InputSelect from "components/Post/InputSelect";
import InputModal from "components/Post/InputModal";

//icon
import album from "assets/icons/Post/album.png";

const StudyPost = () => {
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [proceed, setProceed] = useState("");
  const [people, setPeople] = useState("");
  const [period, setPeriod] = useState("");
  const [schedule, setSchedule] = useState("");
  const [location, setLocation] = useState("");
  const [studyDescription, setStudyDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const editorRef = useRef(null);

  const handleAlbumClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = (event) => {
      const files = Array.from(event.target.files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = document.createElement("img");
          img.src = e.target.result;
          img.className = styles.image;
          img.contentEditable = false;
          img.setAttribute("data-filename", file.name);
          img.setAttribute(
            "data-file-index",
            selectedFiles.length + files.indexOf(file)
          );
          editorRef.current.appendChild(img);
        };
        reader.readAsDataURL(file);
      });
    };
    input.click();
  };

  const extractNodes = (node, descriptionParts, collectedFiles) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      if (text) {
        descriptionParts.push(text);
      }
    } else if (node.nodeName === "DIV") {
      node.childNodes.forEach((child) =>
        extractNodes(child, descriptionParts, collectedFiles)
      );
    } else if (node.nodeName === "IMG") {
      const filename = node.getAttribute("data-filename");
      const fileindex = node.getAttribute("data-file-index");

      if (fileindex >= 0 && fileindex < selectedFiles.length) {
        collectedFiles.push(selectedFiles[fileindex]);
      }
      descriptionParts.push("<img />");
    } else if (node.nodeName === "BR") {
      descriptionParts.push("\n");
    } else {
      node.childNodes.forEach((child) =>
        extractNodes(child, descriptionParts, collectedFiles)
      );
    }
  };

  const handlePostClick = async () => {
    const currentContent = editorRef.current.innerHTML;
    const descriptionParts = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(currentContent, "text/html");
    const collectedFiles = [];

    doc.body.childNodes.forEach((node) =>
      extractNodes(node, descriptionParts, collectedFiles)
    );

    for (let i = 0; i < collectedFiles.length; i++) {
      const file = collectedFiles[i];
      const uniqueFileName = `${uuidv4()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from("Images")
        .upload(`study/${uniqueFileName}`, file);

      if (error) {
        console.error("Error uploading image:", error);
      } else {
        const url = supabase.storage
          .from("Images")
          .getPublicUrl(`${data.path}`);
        const imgTagIndex = descriptionParts.lastIndexOf("<img />");
        if (imgTagIndex !== -1) {
          descriptionParts[imgTagIndex] = `![Image](${url.data.publicUrl})`;
        }
      }
    }

    const finalDescription = descriptionParts.join("\n");
    console.log(finalDescription);

    const { error } = await supabase.from("Study").insert([
      {
        userid: 1, //5,7,1,2
        title: name,
        proceed: proceed,
        maxmembers: people,
        duration: period,
        schedule: schedule,
        location: location,
        description: finalDescription,
        createdat: new Date(),
        updatedat: new Date(),
      },
    ]);

    if (error) {
      console.error("Error inserting data:", error);
    } else {
      console.log("Data inserted successfully!");
    }
  };

  return (
    <div>
      <Header title={"Studies"} onPost={handlePostClick} />
      <div className={styles.postContainer}>
        <InputText
          title={"제목"}
          placeholder={"제목을 입력해 주세요."}
          onChange={(e) => setName(e.target.value)}
        />
        <div style={{ display: "flex", flexDirection: "row" }}>
          <InputSelect
            title={"진행방식"}
            placeholder={"온라인/오프라인"}
            onSelect={setProceed}
          />
          <InputSelect
            title={"모집인원"}
            placeholder={"인원 미정~10명 이상"}
            onSelect={setPeople}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <InputSelect
            title={"기간"}
            placeholder={"기간 미정~6개월 이상"}
            onSelect={setPeriod}
          />
          <InputText
            title={"일정"}
            placeholder={"ex) 매주 월요일 1시"}
            onChange={(e) => setSchedule(e.target.value)}
          />
        </div>
        <InputModal
          title={"장소"}
          placeholder={"오프라인 스터디 진행 시 장소를 입력해주세요."}
          onSelect={setLocation}
        />
        <div className={styles.inputContainer}>
          <div className={styles.inputTitle}>스터디 소개</div>
          <div className={styles.inputFieldWrapper}>
            <div
              ref={editorRef}
              className={styles.inputField}
              contentEditable
              placeholder="스터디 소개를 입력하세요."
              onInput={(e) => setStudyDescription(e.currentTarget.textContent)}
            />
            <div className={styles.fileIconWrapper} onClick={handleAlbumClick}>
              <img className={styles.albumIcon} src={album} alt="albumIcon" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPost;
