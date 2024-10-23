import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CommunityPost.module.css";
import supabase from "components/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "contexts/AuthContext";

// component
import Header from "components/Post/Header";
import InputFile from "components/Post/InputFile";
import InputImage from "components/Post/InputImage";
import InputText from "components/Post/InputText";
import InputSelect from "components/Post/InputSelect";
import InputRule from "components/Post/InputRule";
import CreateModal from "components/Post/CreateModal";

// icons
import caution from "assets/icons/Post/caution.png";

const CommunityPost = (props) => {
  const navigate = useNavigate();
  const { user: sessionUser } = useAuth();
  const [user, setUser] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [field, setField] = useState("");
  const [rules, setRules] = useState([]);
  const [file, setFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCaution, setShowCaution] = useState({
    name: false,
    description: false,
    field: false,
    image: false,
  });

  useEffect(() => {
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

        const { data, error } = await supabase
          .from("User")
          .select("*")
          .eq("userid", userId);

        if (error) {
          console.error("Error", error);
        } else {
          setUser(data);
        }
      } else {
        setUser([]);
      }
    };

    if (sessionUser) {
      fetchUserData();
    }
  }, [sessionUser]);

  const handlePostClick = () => {
    let hasError = false;
    const newCautionState = {
      name: false,
      description: false,
      field: false,
      image: false,
    };

    if (!name) {
      newCautionState.name = true;
      hasError = true;
    }
    if (!description) {
      newCautionState.description = true;
      hasError = true;
    }
    if (!field) {
      newCautionState.field = true;
      hasError = true;
    }
    if (!file) {
      newCautionState.image = true;
      hasError = true;
    }

    setShowCaution(newCautionState);

    if (hasError) return;

    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // const handleCreateClick = async () => {
  //   console.log("field", field.name);
  //   console.log("rules", rules);
  // };

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
          field: field.name,
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
      navigate(`/detail-community/${postData[0].communityid}`, {
        state: {
          userData: user,
        },
      });
    }
  };

  return (
    <div>
      <Header title={"Communities"} onPost={handlePostClick} />
      {isModalOpen && (
        <CreateModal onCreate={handleCreateClick} onCancel={handleModalClose} />
      )}
      <div className={styles.postContainer}>
        <div
          style={{
            minHeight: "72px",
          }}
        >
          <InputImage
            title={"대표 이미지"}
            placeholder={"커뮤니티 대표 이미지를 넣어주세요."}
            onFileSelect={(file) => {
              setFile(file);
              setShowCaution({ ...showCaution, image: false });
            }}
          />
          {showCaution.image && (
            <div className={styles.cautionContainer}>
              <img className={styles.cautionIcon} src={caution} />
              <div className={styles.cautionText}>
                대표 이미지를 넣어주세요.
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            minHeight: "72px",
          }}
        >
          <InputText
            title={"이름"}
            placeholder={"커뮤니티 이름을 입력해주세요."}
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
                커뮤니티 이름을 작성해주세요.
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            minHeight: "72px",
          }}
        >
          <InputText
            title={"설명"}
            placeholder={"커뮤니티에 대해 간단하게 설명해주세요."}
            onChange={(e) => {
              setDescription(e.target.value);
              setShowCaution({ ...showCaution, description: false });
            }}
            value={description}
          />
          {showCaution.description && (
            <div className={styles.cautionContainer}>
              <img className={styles.cautionIcon} src={caution} />
              <div className={styles.cautionText}>
                커뮤니티 설명을 작성해주세요.
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
            title={"분류"}
            placeholder={"분류를 선택해주세요"}
            onSelect={(selectedField) => {
              setField(selectedField);
              setShowCaution({ ...showCaution, field: false });
            }}
          />
          {showCaution.field && (
            <div className={styles.cautionContainer}>
              <img className={styles.cautionIcon} src={caution} />
              <div className={styles.cautionText}>
                커뮤니티 분류를 선택해주세요.
              </div>
            </div>
          )}
        </div>
        <InputRule title={"규칙"} onRulesChange={setRules} />
      </div>
    </div>
  );
};

export default CommunityPost;
