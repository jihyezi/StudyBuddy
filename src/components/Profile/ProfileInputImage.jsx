import React, { useRef, useState } from "react";
import styles from "./ProfileInputImage.module.css";
import "fonts/Font.css";

// icon
import camera from "assets/icons/camera.png";

const ProfileInputImage = (props) => {
    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState(props.placeholder);
    const [isFileSelected, setIsFileSelected] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleClick = (event) => {
        if (!isFileSelected) {
            event.stopPropagation();
            fileInputRef.current.click();
        }
    };

    const handleChange = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setFileName(file.name);
            setIsFileSelected(true);
            setSelectedFile(file);
            props.onFileSelect(file);
        }
    };

    const inputClickStyle = props.title === "profile"
        ? styles.profileInputClick
        : styles.inputClick;

    return (
        <div className={styles.inputContainer}>
            <div className={inputClickStyle} onClick={handleClick}>
                <input
                    style={{ display: "none" }}
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleChange}
                />
                <img
                    className={styles.inputIcon}
                    src={camera}
                    alt="inputIcon"
                />
            </div>
        </div>
    );
};

export default ProfileInputImage;
