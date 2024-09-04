import React, { useState, useEffect } from "react";
import styles from "./InputModal.module.css";
import "fonts/Font.css";
import SearchBookModal from "./SearchBookModal";
import SearchResultModal from "./SearchResultModal";
import SearchPlaceModal from "./SearchPlaceModal";

const InputModal = (props) => {
  const [selectedModal, setSelectedModal] = useState(props.placeholder);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTextColorChanged, setIsTextColorChanged] = useState(false);

  useEffect(() => {
    if (props.initialValue) {
      console.log("initialValue", props.initialValue);
      setSelectedModal(props.initialValue);
      setIsTextColorChanged(true);
    }
  }, [props.initialValue, selectedModal]);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const updateSelectedModal = (value) => {
    console.log("Selected modal value:", value);
    setSelectedModal(value);
    setIsTextColorChanged(true);
    props.onSelect(value);
  };

  return (
    <div className={styles.inputContainer}>
      <div className={styles.inputTitle}>{props.title}</div>
      <div className={styles.inputClick} onClick={handleClick}>
        <span
          className={`${styles.inputPlaceholder} ${
            isTextColorChanged ? styles.activeText : ""
          }`}
        >
          {selectedModal}
        </span>
      </div>

      {isModalOpen && (
        <>
          <div className={styles.overlay} onClick={closeModal}></div>
          {props.title === "책" && (
            <SearchBookModal
              closeModal={closeModal}
              updateSelectedModal={updateSelectedModal}
              initialValue={props.initialValue}
            />
          )}
          {props.title === "결과" && (
            <SearchResultModal
              closeModal={closeModal}
              updateSelectedModal={updateSelectedModal}
              initialValue={props.initialValue}
            />
          )}
          {props.title === "장소" && (
            <SearchPlaceModal
              closeModal={closeModal}
              updateSelectedModal={updateSelectedModal}
            />
          )}
        </>
      )}
    </div>
  );
};

export default InputModal;
