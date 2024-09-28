import React, { useState } from "react";
import styles from './ProfileEditModal.module.css';
import Modal from "react-modal";
import supabase from "components/supabaseClient";

import back from "assets/icons/Post/back.png";
import nobackground from "assets/images/Profile/nobackground.png";
import noprofile from "assets/images/Profile/noprofile.png";
import camera from "assets/icons/camera.png";

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

        const { data: UserData, error: userError } = await supabase
            .from("User")
            .update({
                nickname: name,
                bio: bio,
                birthdate: birthDate || null,
            })
            .eq('userid', userId);

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
                        <button className={styles.saveButton} onClick={handleSaveClick}>save</button>
                    </div>
                </div>

                <div className={styles.imageWrapper}>
                    {backgroundimage ?
                        <img
                            src={backgroundimage}
                            alt="profile background"
                            className={styles.image}
                        />
                        : <img
                            src={nobackground}
                            alt="profile background"
                            className={styles.image}
                        />
                    }
                    <div className={styles.imageCover}>
                        <img src={camera} className={styles.cameraIcon} />
                    </div>
                    <div className={styles.profileImgContainer}>
                        {profileImg ?
                            <img
                                src={profileImg}
                                alt="profile"
                                className={styles.profileImg} />
                            : <img
                                src={noprofile}
                                alt="profile"
                                className={styles.profileImg}
                            />
                        }
                        <div className={styles.profileimageCover}>
                            <img src={camera} className={styles.cameraIcon} />
                        </div>
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
