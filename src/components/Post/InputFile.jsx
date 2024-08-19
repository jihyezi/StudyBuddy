import React, { useRef, useState } from "react";
import styles from "./InputFile.module.css";
import "fonts/Font.css";

// icon
import file from "assets/icons/Post/file.png";
import cancel from "assets/icons/Post/close.png";
import add from "assets/icons/Post/add_grey.png";

const InputFile = (props) => {
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files);
      const newFiles = [...selectedFiles, ...files];
      setSelectedFiles(newFiles);
      props.onFileSelect(newFiles);
    }
  };

  const handleCancel = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    props.onFileSelect(updatedFiles);
    fileInputRef.current.value = null;
  };

  const handleAddClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={styles.inputContainer}>
      <div className={styles.inputText}>{props.title}</div>
      <input
        style={{ display: "none" }}
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        multiple
      />
      {selectedFiles.map((file, index) => (
        <div key={index} className={styles.fileSelectedContainer}>
          <span className={styles.fileName}>{file.name}</span>
          <img
            className={styles.inputIcon}
            src={cancel}
            alt="cancelIcon"
            onClick={() => handleCancel(index)}
          />
        </div>
      ))}
      <div className={styles.addIconContainer} onClick={handleAddClick}>
        <img className={styles.addIcon} src={add} alt="addIcon" />
      </div>
    </div>
  );
};

export default InputFile;
