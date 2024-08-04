import React, { useRef, useState } from "react";
import styles from "./InputFile.module.css";
import "fonts/Font.css";

// icon
import file from "assets/icons/Post/file.png";
import cancel from "assets/icons/Post/close.png";
import add from "assets/icons/Post/add_grey.png";

const InputFile = (props) => {
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

  const handleCancel = (event) => {
    event.stopPropagation();
    setFileName(props.placeholder);
    setIsFileSelected(false);
  };

  return (
    <div className={styles.inputContainer}>
      <div className={styles.inputText}>{props.title}</div>
      <div className={styles.inputClick} onClick={handleClick}>
        <input
          style={{ display: "none" }}
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
        />
        <span
          className={`${styles.inputPlaceholder} ${
            isFileSelected ? styles.fileSelected : ""
          }`}
        >
          {isFileSelected ? fileName : props.placeholder}
        </span>
        <img
          className={styles.inputIcon}
          src={isFileSelected ? cancel : file}
          alt="inputIcon"
          onClick={isFileSelected ? handleCancel : undefined}
        />
      </div>
    </div>
  );
};

export default InputFile;
