import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styles from "./ReviseStudy.module.css";
import supabase from "components/supabaseClient";
import { useAuth } from "contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

// component
import Header from "components/Post/Header";
import InputText from "components/Post/InputText";
import InputSelect from "components/Post/InputSelect";
import InputModal from "components/Post/InputModal";
import CreateModal from "components/Post/CreateModal";
import InputTag from "components/Post/InputTag";

//icon
import album from "assets/icons/Post/album.png";
import caution from "assets/icons/Post/caution.png";

const ReviseStudyPost = ({ allUserData }) => {
  const navigate = useNavigate();
  const { studyId } = useParams();
  const [name, setName] = useState("");
  const [proceed, setProceed] = useState("");
  const [people, setPeople] = useState("");
  const [period, setPeriod] = useState("");
  const [completion, setCompletion] = useState("");
  const [schedule, setSchedule] = useState("");
  const [location, setLocation] = useState("");
  const [studyDescription, setStudyDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [tags, setTags] = useState([]);
  const editorRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCaution, setShowCaution] = useState({
    name: false,
    proceed: false,
    people: false,
    period: false,
    completion: false,
    schedule: false,
    location: false,
    studyDescription: false,
  });

  const [loginUser, setLoginUser] = useState(null);
  const { user: sessionUser } = useAuth();
  const uselocation = useLocation();
  const { study } = uselocation.state;
  const queryClient = useQueryClient();

  useEffect(() => {
    setName(study.title);
    setProceed(study.proceed);
    setPeople(study.maxmembers);
    setPeriod(study.duration);
    setCompletion(study.completion);
    setSchedule(study.schedule);
    setLocation(study.location);
    setStudyDescription(study.description);
    setTags(study.tag);

    if (editorRef.current) {
      const htmlDescription = study.description
        .replace(
          /!\[.*?\]\((.*?)\)/g,
          '<img src="$1" alt="Image" style="max-width: 100%; height: auto;" class="${styles.image}" />'
        )
        .replace(/\n/g, "<br>");
      editorRef.current.innerHTML = htmlDescription;
    }

    fetchUserData();
  }, [study]);

  const fetchUserData = async () => {
    if (sessionUser) {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Error getting session:", sessionError);
        return;
      }

      const userId = session.user.id;
      setLoginUser(allUserData.filter((user) => user.userid === userId));
    }
  };

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
    setShowCaution({ ...showCaution, studyDescription: false });
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

  const handlePostClick = () => {
    let hasError = false;
    const newCautionState = {
      name: false,
      proceed: false,
      people: false,
      period: false,
      schedule: false,
      location: false,
      studyDescription: false,
    };

    if (!name) {
      newCautionState.name = true;
      hasError = true;
    }
    if (!proceed) {
      newCautionState.proceed = true;
      hasError = true;
    }
    if (!people) {
      newCautionState.people = true;
      hasError = true;
    }
    if (!period) {
      newCautionState.period = true;
      hasError = true;
    }
    if (!schedule) {
      newCautionState.schedule = true;
      hasError = true;
    }
    if (proceed.name === "오프라인" && !location) {
      newCautionState.location = true;
      hasError = true;
    }
    if (!proceed && !location) {
      newCautionState.location = true;
      hasError = true;
    }
    if (!studyDescription) {
      newCautionState.studyDescription = true;
      hasError = true;
    }

    setShowCaution(newCautionState);

    if (hasError) return;

    setIsModalOpen(true);
  };

  const handleModalClose = () => {
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

    const { data: updatedStudyData, error: studyError } = await supabase
      .from("Study")
      .update([
        {
          userid: userId,
          title: name,
          proceed: proceed.name,
          maxmembers: people.name,
          duration: period.name,
          schedule: schedule,
          location: location,
          description: finalDescription,
          tag: tags,
          // createdat: new Date(),
          updatedat: new Date(),
          completion: completion.name,
        },
      ])
      .eq("studyid", studyId)
      .select();

    if (studyError) {
      console.error("Error updating data:", studyError);
    } else {
      console.log("Data update successfully!", updatedStudyData[0].studyid);
      fetchUserData();
      navigate(`/detail-study/${updatedStudyData[0].studyid}`);
      // window.location.reload();
    }
  };

  return (
    <div>
      <Header title={"Studies"} onPost={handlePostClick} />
      {isModalOpen && (
        <CreateModal
          title={"Study"}
          onCreate={handleCreateClick}
          onCancel={handleModalClose}
        />
      )}
      <div className={styles.postContainer}>
        <div
          style={{
            minHeight: "72px",
          }}
        >
          <InputText
            title={"제목"}
            placeholder={"제목을 입력해 주세요."}
            onChange={(e) => {
              setName(e.target.value);
              setShowCaution({ ...showCaution, name: false });
            }}
            value={name}
          />
          {showCaution.name && (
            <div className={styles.cautionContainer}>
              <img className={styles.cautionIcon} src={caution} />
              <div className={styles.cautionText}>
                스터디 이름을 입력해주세요.
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "row" }}>
          <div
            style={{
              minHeight: "72px",
            }}
          >
            <InputSelect
              title={"진행방식"}
              placeholder={"온라인/오프라인"}
              onSelect={(selectedOption) => {
                console.log(selectedOption);
                setProceed(selectedOption);
                setShowCaution({ ...showCaution, proceed: false });
              }}
              defaultValue={proceed}
            />
            {showCaution.proceed && (
              <div className={styles.cautionContainer}>
                <img className={styles.cautionIcon} src={caution} />
                <div className={styles.cautionText}>
                  진행방식을 선택해주세요.
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              minHeight: "72px",
            }}
          >
            <InputSelect
              title={"모집인원"}
              placeholder={"인원 미정~10명 이상"}
              onSelect={(selectedOption) => {
                setPeople(selectedOption);
                setShowCaution({ ...showCaution, people: false });
              }}
              defaultValue={people}
            />
            {showCaution.people && (
              <div className={styles.cautionContainer}>
                <img className={styles.cautionIcon} src={caution} />
                <div className={styles.cautionText}>
                  모집인원을 선택해주세요.
                </div>
              </div>
            )}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div
            style={{
              minHeight: "72px",
            }}
          >
            <InputSelect
              title={"기간"}
              placeholder={"기간 미정~6개월 이상"}
              onSelect={(selectedOption) => {
                setPeriod(selectedOption);
                setShowCaution({ ...showCaution, period: false });
              }}
              defaultValue={period}
            />
            {showCaution.period && (
              <div className={styles.cautionContainer}>
                <img className={styles.cautionIcon} src={caution} />
                <div className={styles.cautionText}>
                  진행기간을 선택해주세요.
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              minHeight: "72px",
            }}
          >
            <InputSelect
              title={"모집상태"}
              placeholder={"모집 중/모집 완료"}
              onSelect={(selectedOption) => {
                setCompletion(selectedOption);
                setShowCaution({ ...showCaution, completion: false });
              }}
              defaultValue={completion}
            />
            {showCaution.completion && (
              <div className={styles.cautionContainer}>
                <img className={styles.cautionIcon} src={caution} />
                <div className={styles.cautionText}>
                  모집 상태를 선택해주세요.
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
          <InputText
            title={"일정"}
            placeholder={"ex) 매주 월요일 1시"}
            onChange={(e) => {
              setSchedule(e.target.value);
              setShowCaution({ ...showCaution, schedule: false });
            }}
            value={schedule}
          />
          {showCaution.schedule && (
            <div className={styles.cautionContainer}>
              <img className={styles.cautionIcon} src={caution} />
              <div className={styles.cautionText}>일정를 입력해주세요.</div>
            </div>
          )}
        </div>

        <div
          style={{
            minHeight: "72px",
          }}
        >
          <InputModal
            title={"장소"}
            placeholder={"오프라인 스터디 진행 시 장소를 입력해주세요."}
            onSelect={(e) => {
              setLocation(e);
              setShowCaution({ ...showCaution, location: false });
            }}
            initialValue={location}
          />
          {showCaution.location && (
            <div className={styles.cautionContainer}>
              <img className={styles.cautionIcon} src={caution} />
              <div className={styles.cautionText}>
                오프라인 장소를 입력해주세요.
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            minHeight: "72px",
          }}
        >
          <div className={styles.inputContainer}>
            <div className={styles.inputTitle}>스터디 소개</div>
            <div className={styles.inputFieldWrapper}>
              <div
                ref={editorRef}
                className={styles.inputField}
                contentEditable
                placeholder="스터디 소개를 입력하세요."
                onInput={(e) => {
                  const content = e.currentTarget.innerHTML;
                  setStudyDescription(content);
                  // setStudyDescription(e.currentTarget.textContent);
                  setShowCaution({ ...showCaution, studyDescription: false });
                }}
              />
              <div
                className={styles.fileIconWrapper}
                onClick={handleAlbumClick}
              >
                <img className={styles.albumIcon} src={album} alt="albumIcon" />
              </div>
            </div>
          </div>
          {showCaution.studyDescription && (
            <div className={styles.cautionContainer}>
              <img className={styles.cautionIcon} src={caution} />
              <div className={styles.cautionText}>
                스터디 소개를 입력해주세요.
              </div>
            </div>
          )}
        </div>
        <div
          style={{
            marginTop: "15px",
          }}
        >
          <InputTag tags={tags} onChange={setTags} />
        </div>
      </div>
    </div>
  );
};

export default ReviseStudyPost;