import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./RevisePost.module.css";
import supabase from "components/supabaseClient";
import { v4 as uuidv4 } from "uuid";

// component
import Header from "components/Post/Header";
import InputFile from "components/Post/InputFile";
import InputText from "components/Post/InputText";
import InputModal from "components/Post/InputModal";
import InputDate from "components/Post/InputDate";
import InputSelect from "components/Post/InputSelect";

//icon
import album from "assets/icons/Post/album.png";

const RevisePost = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const postData = JSON.parse(decodeURIComponent(query.get("postData")));
  const [community, setCommunity] = useState("");
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [book, setBook] = useState("");
  const [result, setResult] = useState("");
  const [studyMethod, setStudyMethod] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [files, setFiles] = useState(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (postData) {
      console.log("postData", postData.references[0].filename);
      setCommunity(postData.communityid);
      setTitle(postData.title);
      setStartDate(postData.startdate);
      setEndDate(postData.enddate);
      setBook(postData.book);
      setResult(postData.result);
      setSelectedFiles(postData.references || []);

      const content = postData.content;
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");

      const descriptionParts = [];
      const collectedFiles = [];

      const extractNodes = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent.trim();
          if (text) {
            descriptionParts.push(text);
          }
        } else if (node.nodeName === "IMG") {
          const imgTag = `<img src="${node.src}" alt="${node.getAttribute(
            "data-filename"
          )}" />`;
          descriptionParts.push(imgTag);
        } else if (node.nodeName === "BR") {
          descriptionParts.push("\n");
        } else {
          node.childNodes.forEach((child) => extractNodes(child));
        }
      };

      doc.body.childNodes.forEach((node) => extractNodes(node));

      setStudyMethod(descriptionParts.join("\n"));
      editorRef.current.innerHTML = content;
    }
  }, []);

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
      // const filename = node.getAttribute("data-filename");
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

  const base64Encode = (str) => {
    return btoa(unescape(encodeURIComponent(str)));
  };

  const base64Decode = (str) => {
    return decodeURIComponent(escape(atob(str)));
  };

  const handlePostClick = async () => {
    console.log("title", title);
    console.log("startDate", startDate);
    console.log("endDate", endDate);
    console.log("result", result);
    console.log("book", book);
    console.log("studyMethod", studyMethod);
    console.log("references", selectedFiles);
    console.log("createdat", postData.createdat);
    console.log("community", community);
  };

  const handlePostClicks = async () => {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    const userId = session.user.id;

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
      const uniqueFileName = `${uuidv4()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "")}`;
      const { data, error } = await supabase.storage
        .from("Images")
        .upload(`post/${uniqueFileName}`, file);

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
    const downloadUrls = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const encodedName = base64Encode(file.name);
      console.log(base64Decode(encodedName));
      const { data, error } = await supabase.storage
        .from("Files")
        .upload(`post/${encodedName}`, file);

      if (error) {
        console.error("Error uploading image:", error);
      } else {
        const url = supabase.storage.from("Files").getPublicUrl(`${data.path}`);

        if (!url.data.publicUrl) {
          console.error("Error getting public URL:", url.data.publicUrl);
        } else {
          downloadUrls.push({
            url: url.data.publicUrl,
            filename: base64Decode(encodedName),
          });
          console.log(
            "File uploaded successfully. Download URL:",
            url.data.publicUrl
          );
        }
      }
    }

    const { error } = await supabase.from("Post").update([
      {
        userid: userId,
        communityid: community,
        title: title,
        startdate: startDate,
        enddate: endDate,
        book: book,
        result: result,
        content: finalDescription,
        references: downloadUrls,
        createdat: postData.createdat,
        updatedat: new Date(),
      },
    ]);
    console.log("references", postData.references);

    if (error) {
      console.error("Error inserting data:", error);
    } else {
      console.log("Data inserted successfully!");
    }
  };

  const handleCommunity = (selectedOption) => {
    console.log("Selected Name:", selectedOption.name);
    console.log("Selected Community ID:", selectedOption.communityId);
    setCommunity(selectedOption.communityId);
  };

  const handleTitleChange = (e) => {
    console.log("Input value:", e.target.value); // 입력값 로그
    setTitle(e.target.value);
  };

  return (
    <div>
      <Header title={"Post"} onPost={handlePostClick} />
      <div className={styles.postContainer}>
        <InputSelect
          title={"커뮤니티"}
          placeholder={"커뮤니티를 선택해주세요"}
          defaultValue={community}
          onSelect={handleCommunity}
        />
        <InputText
          title={"제목"}
          placeholder={"제목을 입력해 주세요."}
          // onChange={(e) => setTitle(e.target.value)}
          onChange={handleTitleChange}
          value={title}
        />
        <div style={{ display: "flex", flexDirection: "row" }}>
          <InputDate
            title={"시작날짜"}
            placeholder={"시작날짜를 선택해 주세요."}
            onDateChange={setStartDate}
            selectedDate={postData.startdate}
          />
          <InputDate
            title={"종료날짜"}
            placeholder={"종료날짜를 선택해 주세요."}
            onDateChange={setEndDate}
            minDate={startDate}
            selectedDate={postData.enddate}
          />
        </div>
        <InputModal
          title={"책"}
          placeholder={"책을 입력해 주세요."}
          onSelect={setBook}
          initialValue={book}
        />
        <InputModal
          title={"결과"}
          placeholder={"결과를 입력해 주세요."}
          onSelect={setResult}
          initialValue={result}
        />
        <div className={styles.inputContainer}>
          <div className={styles.inputTitle}>공부 방법</div>
          <div className={styles.inputFieldWrapper}>
            <div
              ref={editorRef}
              className={styles.inputField}
              contentEditable
              placeholder="공부 방법을 입력하세요."
              onInput={(e) => setStudyMethod(e.currentTarget.textContent)}
              dangerouslySetInnerHTML={{
                __html: studyMethod.replace(/\n/g, "<br />"),
              }}
            />
            <div className={styles.albumIconWrapper} onClick={handleAlbumClick}>
              <img className={styles.albumIcon} src={album} alt="albumIcon" />
            </div>
          </div>
        </div>
        <InputFile
          title={"자료"}
          placeholder={"파일을 첨부해 주세요."}
          onFileSelect={(file) => setFiles(file)}
          initialFiles={selectedFiles}
        />
      </div>
    </div>
  );
};

export default RevisePost;
