import React, { useRef, useState } from "react";
import styles from "./InputFile.module.css";
import "fonts/Font.css";

// icon
import file from "assets/icons/Post/file.png";

const InputFile = (props) => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState(props.placeholder);
  const [isFileSelected, setIsFileSelected] = useState(false);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
      setIsFileSelected(true);
    }
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
          {fileName}
        </span>
        <img className={styles.inputIcon} src={file} alt="inputIcon" />
      </div>
    </div>
  );
};

export default InputFile;
