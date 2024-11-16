import React, { useState, useEffect } from "react";
import styles from "./ProfileEditModal.module.css";
import Modal from "react-modal";
import supabase from "components/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { useMutation } from "@tanstack/react-query";
import { useDataContext } from "api/DataContext";

// Images
import back from "assets/icons/Post/back.png";
import nobackground from "assets/images/Profile/nobackground.png";
import noprofile from "assets/images/Profile/noprofile.png";
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

const ProfileEditModal = ({ modalIsOpen, closeModal, userData }) => {
    const { refetchUserData } = useDataContext();
    const [name, setName] = useState(userData.nickname);
    const [bio, setBio] = useState(userData.bio);
    const [birthDate, setBirthDate] = useState(userData.birthdate);
    const [profilePreview, setProfilePreview] = useState(userData.profileimage);
    const [backgroundPreview, setBackgroundPreview] = useState(userData.backgroundimage);
    const [profileFile, setProfileFile] = useState(null);
    const [backgroundFile, setBackgroundFile] = useState(null);

    // 미리보기
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

    const mutation = useMutation({
        mutationFn: async () => {
            const userId = userData.userid;

            // 프로필 이미지 업로드
            let profileImgUrl = userData.profileimage;
            if (profileFile) {
                const uniqueFileName = `${uuidv4()}-${profileFile.name.replace(/[^a-zA-Z0-9.]/g, "")}`;
                const { data, error } = await supabase.storage
                    .from("Images")
                    .upload(`user/${uniqueFileName}`, profileFile);

                if (error) {
                    throw new Error("프로필 이미지 업로드 오류: " + error.message);
                } else {
                    profileImgUrl = supabase.storage
                        .from("Images")
                        .getPublicUrl(`${data.path}`).data.publicUrl;
                }
            }

            // 배경 이미지 업로드
            let backgroundImgUrl = userData.backgroundimage;
            if (backgroundFile) {
                const uniqueFileName = `${uuidv4()}-${backgroundFile.name.replace(/[^a-zA-Z0-9.]/g, "")}`;
                const { data, error } = await supabase.storage
                    .from("Images")
                    .upload(`user/${uniqueFileName}`, backgroundFile);

                if (error) {
                    throw new Error("배경 이미지 업로드 오류: " + error.message);
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
                    profileimage: profileImgUrl,
                    backgroundimage: backgroundImgUrl,
                })
                .eq("userid", userId);

            if (userError) {
                throw new Error("데이터 업데이트 오류: " + userError.message);
            }
        },
        onSuccess: () => {
            refetchUserData();
            closeModal();
        },
        onError: (error) => {
            console.error('mutation 오류', error);
        }
    });

    const handleSaveClick = async () => {
        mutation.mutate();
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
