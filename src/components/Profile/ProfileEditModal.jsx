import React, { useState, useEffect } from "react";
import styles from "./ProfileEditModal.module.css";
import Modal from "react-modal";
import supabase from "components/supabaseClient";
import { v4 as uuidv4 } from "uuid";

import back from "assets/icons/Post/back.png";
import nobackground from "assets/images/Profile/nobackground.png";
import noprofile from "assets/images/Profile/noprofile.png";
import camera from "assets/icons/camera.png";
import ProfileInputImage from "./ProfileInputImage";

const customStyles = {
    content: {
        width: "760px",
        height: "680px",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        borderRadius: "30px",
        borderColor: "#fff",
        opacity: "1",
    },
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.40)",
        zIndex: 1000,
    },
};
Modal.setAppElement("#root");

const ProfileEditModal = ({ modalIsOpen, closeModal, profileImg, backgroundimage, userData, userNickname }) => {
    const [name, setName] = useState(userNickname);
    const [bio, setBio] = useState(userData.bio);
    const [birthDate, setBirthDate] = useState("");
    const [profileFile, setProfileFile] = useState(null);
    const [backgroundFile, setBackgroundFile] = useState(null);
    const [profilePreview, setProfilePreview] = useState(profileImg);
    const [backgroundPreview, setBackgroundPreview] = useState(backgroundimage);

    // 파일 선택 시 미리보기 생성
    useEffect(() => {
        if (profileFile) {
            const objectUrl = URL.createObjectURL(profileFile);
            setProfilePreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [profileFile]);

    useEffect(() => {
        if (backgroundFile) {
            const objectUrl = URL.createObjectURL(backgroundFile);
            setBackgroundPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [backgroundFile]);

    const handleSaveClick = async () => {
        const {
            data: { session },
            error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
            console.error("세션 오류:", sessionError);
            return;
        }

        const userId = session.user.id;

        // 프로필 이미지 업로드
        let profileImgUrl = profileImg;
        if (profileFile) {
            // 한글 및 특수 문자를 제거한 파일 이름 생성
            const uniqueFileName = `${uuidv4()}-${profileFile.name.replace(/[^a-zA-Z0-9.]/g, "")}`;
            const { data, error } = await supabase.storage
                .from("Images")
                .upload(`user/${uniqueFileName}`, profileFile);

            if (error) {
                console.error("프로필 이미지 업로드 오류:", error);
            } else {
                profileImgUrl = supabase.storage
                    .from("Images")
                    .getPublicUrl(`${data.path}`).data.publicUrl;
            }
        }

        // 배경 이미지 업로드
        let backgroundImgUrl = backgroundimage;
        if (backgroundFile) {
            const uniqueFileName = `${uuidv4()}-${backgroundFile.name}`;
            const { data, error } = await supabase.storage
                .from("Images")
                .upload(`user/${uniqueFileName}`, backgroundFile);

            if (error) {
                console.error("배경 이미지 업로드 오류:", error);
            } else {
                backgroundImgUrl = supabase.storage
                    .from("Images")
                    .getPublicUrl(`${data.path}`).data.publicUrl;
            }
        }

        // 데이터베이스 업데이트
        const { data: UserData, error: userError } = await supabase
            .from("User")
            .update({
                nickname: name,
                bio: bio,
                birthdate: birthDate || null,
                profileimage: profileImgUrl, // 프로필 이미지 URL 저장
                backgroundimage: backgroundImgUrl, // 배경 이미지 URL 저장
            })
            .eq("userid", userId);

        if (userError) {
            console.error("데이터 업데이트 오류:", userError);
            return;
        }

        closeModal();
    };

    return (
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="프로필 수정 모달"
        >
            <div className={styles.profileEditModal}>
                <div className={styles.profileEditModalHeader}>
                    <div className={styles.headerLeft}>
                        <img
                            className={styles.closeIcon}
                            src={back}
                            alt="close"
                            onClick={closeModal}
                        />
                        <div className={styles.headerText}>프로필 수정</div>
                    </div>
                    <div className={styles.headerRight}>
                        <button className={styles.saveButton} onClick={handleSaveClick}>
                            save
                        </button>
                    </div>
                </div>

                <div className={styles.imageWrapper}>
                    {/* 배경 이미지 미리보기 */}
                    {backgroundPreview ? (
                        <img
                            src={backgroundPreview}
                            alt="profile background"
                            className={styles.image}
                        />
                    ) : (
                        <img
                            src={nobackground}
                            alt="profile background"
                            className={styles.image}
                        />
                    )}
                    <ProfileInputImage title={"background"} onFileSelect={setBackgroundFile} />

                    {/* 프로필 이미지 미리보기 */}
                    <div className={styles.profileImgContainer}>
                        {profilePreview ? (
                            <img
                                src={profilePreview}
                                alt="profile"
                                className={styles.profileImg}
                            />
                        ) : (
                            <img
                                src={noprofile}
                                alt="profile"
                                className={styles.profileImg}
                            />
                        )}
                        <ProfileInputImage title={"profile"} onFileSelect={setProfileFile} />
                    </div>
                </div>

                <div className={styles.formContainer}>
                    <div className={styles.formItem}>
                        <div className={styles.labelText}>이름</div>
                        <input
                            type="text"
                            className={styles.inputField}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className={styles.formItem}>
                        <div className={styles.labelText}>한줄소개</div>
                        <input
                            type="text"
                            className={styles.inputField}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />
                    </div>
                    <div className={styles.formItem}>
                        <div className={styles.labelText}>생일</div>
                        <input
                            type="date"
                            className={styles.inputField}
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ProfileEditModal;
