import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Post.module.css";
import supabase from "components/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "contexts/AuthContext";

// component
import Header from "components/Post/Header";
import InputFile from "components/Post/InputFile";
import InputText from "components/Post/InputText";
import InputModal from "components/Post/InputModal";
import InputDate from "components/Post/InputDate";
import InputSelect from "components/Post/InputSelect";
import CreateModal from "components/Post/CreateModal";

//icon
import album from "assets/icons/Post/album.png";
import caution from "assets/icons/Post/caution.png";

const Post = () => {
  const navigate = useNavigate();

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCaution, setShowCaution] = useState({
    community: false,
    title: false,
    startDate: false,
    endDate: false,
    book: false,
    result: false,
    studyMethod: false,
  });

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
    setShowCaution({ ...showCaution, studyMethod: false });
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

  const base64Encode = (str) => {
    return btoa(unescape(encodeURIComponent(str)));
  };

  const base64Decode = (str) => {
    return decodeURIComponent(escape(atob(str)));
  };

  const handlePostClick = () => {
    let hasError = false;
    const newCautionState = {
      community: false,
      title: false,
      startDate: false,
      endDate: false,
      book: false,
      result: false,
      studyMethod: false,
    };

    if (!community) {
      newCautionState.community = true;
      hasError = true;
    }
    if (!title) {
      newCautionState.title = true;
      hasError = true;
    }
    if (!startDate) {
      newCautionState.startDate = true;
      hasError = true;
    }
    if (!endDate) {
      newCautionState.endDate = true;
      hasError = true;
    }
    if (!book) {
      newCautionState.book = true;
      hasError = true;
    }
    if (!result) {
      newCautionState.result = true;
      hasError = true;
    }
    if (!studyMethod) {
      newCautionState.studyMethod = true;
      hasError = true;
    }

    setShowCaution(newCautionState);

    if (hasError) return;

    setIsModalOpen(true);
  };

  const handleCancelClick = () => {
    setIsModalOpen(false);
  };

  const handleCreateClick = async () => {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Error getting session:", sessionError);
      return;
    }

    if (!session) {
      console.error("No session found. User might not be logged in.");
      return;
    }

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
      const uniqueFileName = `${uuidv4()}-${file.name.replace(
        /[^a-zA-Z0-9.]/g,
        ""
      )}`;
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

    if (files && files.length > 0) {
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
          const url = supabase.storage
            .from("Files")
            .getPublicUrl(`${data.path}`);

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

      const currentDate = new Date();
      currentDate.setHours(currentDate.getHours() + 9);
      const { data: postData, error: postError } = await supabase
        .from("Post")
        .insert([
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
            createdat: currentDate,
            updatedat: currentDate,
          },
        ])
        .select();

      if (postError) {
        console.error("Error inserting data:", postError);
      } else {
        console.log("Data inserted successfully!", postData[0]);
        navigate(`/detail-post/${postData[0].postid}`);
      }
    } else {
      const currentDate = new Date();
      currentDate.setHours(currentDate.getHours() + 9);

      const { data: postData, error: postError } = await supabase
        .from("Post")
        .insert([
          {
            userid: userId,
            communityid: community,
            title: title,
            startdate: startDate,
            enddate: endDate,
            book: book,
            result: result,
            content: finalDescription,
            // references: downloadUrls,
            createdat: currentDate,
            updatedat: currentDate,
          },
        ])
        .select();

      if (postError) {
        console.error("Error inserting data:", postError);
      } else {
        console.log("Data inserted successfully!", postData[0]);
        navigate(`/detail-post/${postData[0].postid}`);
      }
    }
  };

  return (
    <div className={styles.container}>
      <Header title={"Post"} onPost={handlePostClick} />
      {isModalOpen && (
        <CreateModal
          title={"Post"}
          onCreate={handleCreateClick}
          onCancel={handleCancelClick}
        />
      )}
      <div className={styles.postContainer}>
        <div
          style={{
            minHeight: "72px",
          }}
        >
          <InputSelect
            title={"커뮤니티"}
            placeholder={"커뮤니티를 선택해주세요"}
            onSelect={(selectedOption) => {
              setCommunity(selectedOption.communityId);
              setShowCaution({ ...showCaution, community: false });
            }}
          />
          {showCaution.community && (
            <div className={styles.cautionContainer}>
              <img className={styles.cautionIcon} src={caution} />
              <div className={styles.cautionText}>커뮤니티를 선택해주세요.</div>
            </div>
          )}
        </div>

        <div
          style={{
            minHeight: "72px",
          }}
        >
          <InputText
            title={"제목"}
            placeholder={"제목을 입력해 주세요."}
            onChange={(e) => {
              setTitle(e.target.value);
              setShowCaution({ ...showCaution, title: false });
            }}
          />
          {showCaution.title && (
            <div className={styles.cautionContainer}>
              <img className={styles.cautionIcon} src={caution} />
              <div className={styles.cautionText}>제목을 입력해주세요.</div>
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              minHeight: "72px",
            }}
          >
            <InputDate
              title={"시작날짜"}
              placeholder={"시작날짜를 선택해 주세요."}
              onDateChange={(e) => {
                setStartDate(e);
                setShowCaution({ ...showCaution, startDate: false });
              }}
            />
            {showCaution.startDate && (
              <div className={styles.cautionContainer}>
                <img className={styles.cautionIcon} src={caution} />
                <div className={styles.cautionText}>
                  시작날짜를 선택해주세요.
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              minHeight: "72px",
            }}
          >
            <InputDate
              small
              title={"종료날짜"}
              placeholder={"종료날짜를 선택해 주세요."}
              onDateChange={(e) => {
                setEndDate(e);
                setShowCaution({ ...showCaution, endDate: false });
              }}
              minDate={startDate}
            />
            {showCaution.endDate && (
              <div className={styles.cautionContainer}>
                <img className={styles.cautionIcon} src={caution} />
                <div className={styles.cautionText}>
                  종료날짜를 선택해주세요.
                </div>
              </div>
            )}
          </div>
        </div>
        <div
          style={{
            minHeight: "72px",
          }}
        >
          <InputModal
            title={"책"}
            placeholder={"책을 입력해 주세요."}
            onSelect={(e) => {
              setBook(e);
              setShowCaution({ ...showCaution, book: false });
            }}
          />
          {/* <InputText
            title={"책"}
            placeholder={"책을 입력해 주세요."}
            onSelect={(e) => {
              setBook(e);
              setShowCaution({ ...showCaution, book: false });
            }}
          /> */}
          {showCaution.book && (
            <div className={styles.cautionContainer}>
              <img className={styles.cautionIcon} src={caution} />
              <div className={styles.cautionText}>책을 입력해주세요.</div>
            </div>
          )}
        </div>

        <div
          style={{
            minHeight: "72px",
          }}
        >
          <InputModal
            title={"결과"}
            placeholder={"결과를 입력해 주세요."}
            onSelect={(e) => {
              setResult(e);
              setShowCaution({ ...showCaution, result: false });
            }}
          />
          {showCaution.result && (
            <div className={styles.cautionContainer}>
              <img className={styles.cautionIcon} src={caution} />
              <div className={styles.cautionText}>결과를 입력해주세요.</div>
            </div>
          )}
        </div>

        <div
          style={{
            minHeight: "72px",
          }}
        >
          <div className={styles.inputContainer}>
            <div className={styles.inputTitle}>공부 방법</div>
            <div className={styles.inputFieldWrapper}>
              <div
                ref={editorRef}
                className={styles.inputField}
                contentEditable
                placeholder="공부 방법을 입력하세요."
                onInput={(e) => {
                  setStudyMethod(e.currentTarget.textContent);
                  setShowCaution({ ...showCaution, studyMethod: false });
                }}
              />
              <div
                className={styles.albumIconWrapper}
                onClick={handleAlbumClick}
              >
                <img className={styles.albumIcon} src={album} alt="albumIcon" />
              </div>
            </div>
          </div>
          {showCaution.studyMethod && (
            <div className={styles.cautionContainer}>
              <img className={styles.cautionIcon} src={caution} />
              <div className={styles.cautionText}>공부방법을 입력해주세요.</div>
            </div>
          )}
        </div>
        <InputFile
          title={"자료"}
          placeholder={"파일을 첨부해 주세요."}
          onFileSelect={(file) => setFiles(file)}
        />
      </div>
    </div>
  );
};

export default Post;
