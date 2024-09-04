import React, { useRef, useState } from "react";
import styles from "./InputTag.module.css";
import "fonts/Font.css";

// icon
import cancel from "assets/icons/Post/close.png";
import add from "assets/icons/Post/add_grey.png";

const InputTag = (props) => {
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [tags, setTags] = useState([""]);
  const [isEditing, setIsEditing] = useState([false]);

  const handleTagChange = (index, value) => {
    const updatedTags = [...tags];
    updatedTags[index] = value;
    setTags(updatedTags);
    props.onChange(updatedTags);
  };

  const handleAddTag = () => {
    setTags([...tags, ""]);
    setIsEditing([...isEditing, false]);
  };

  const handleToggleEdit = (index) => {
    const updatedEditing = [...isEditing];
    updatedEditing[index] = !updatedEditing[index];
    setIsEditing(updatedEditing);
  };

  const handleKeyPress = (e, index) => {
    if (e.key === "Enter") {
      handleToggleEdit(index);
    }
  };

  return (
    <div className={styles.inputContainer}>
      <div className={styles.inputText}>태그</div>

      {tags.map((tag, index) => (
        <div key={index} className={styles.tagInputContainer}>
          {isEditing[index] ? (
            <input
              className={styles.tagInput}
              type="text"
              value={tag}
              onChange={(e) => handleTagChange(index, e.target.value)}
              onBlur={() => handleToggleEdit(index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              autoFocus
            />
          ) : (
            <div
              className={styles.tagText}
              onClick={() => handleToggleEdit(index)}
            >
              {tag === "" ? "태그 입력" : tag}
            </div>
          )}

          <img
            className={styles.inputIcon}
            src={cancel}
            alt="cancelIcon"
            onClick={() => {
              const updatedTags = tags.filter((_, i) => i !== index);
              const updatedEditing = isEditing.filter((_, i) => i !== index);
              setTags(updatedTags);
              setIsEditing(updatedEditing);
              props.onChange(updatedTags);
            }}
          />
        </div>
      ))}

      <div className={styles.addIconContainer} onClick={handleAddTag}>
        <img className={styles.addIcon} src={add} alt="addIcon" />
      </div>
    </div>
  );
};

export default InputTag;
