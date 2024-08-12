import React, { useEffect, useRef, useState } from "react";
import styles from "./InputSelect.module.css";
import "fonts/Font.css";
import { selectList } from "./SelectList.jsx";

// icon
import down from "assets/icons/Post/down.png";

const InputSelect = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(props.placeholder);
  const inputRef = useRef(null);

  const selectOptions = (() => {
    switch (props.title) {
      case "분류":
        return selectList.classifications;
      case "진행방식":
        return selectList.proceed;
      case "모집인원":
        return selectList.people;
      case "기간":
        return selectList.period;
      default:
        return selectList.classifications;
    }
  })();
  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const handleOutsideClick = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const placeholderStyle = {
    color: selectedOption === props.placeholder ? "#b6b6b6" : "#808080",
  };

  return (
    <div className={styles.inputContainer} ref={inputRef}>
      <div className={styles.inputTitle}>{props.title}</div>
      <div
        className={`${styles.inputClick} ${isOpen ? styles.inputClickIsOpen : ""
          }`}
        onClick={handleClick}
      >
        <span className={styles.inputPlaceholder} style={placeholderStyle}>
          {selectedOption}
        </span>
        <img className={styles.inputIcon} src={down} alt="inputIcon" />
        {isOpen && (
          <div className={styles.dropdown}>
            {selectOptions.map((option, index) => {
              return (
                <div
                  key={index}
                  className={styles.dropdownOption}
                  onClick={() => handleOptionClick(option.name)}
                >
                  {option.name}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputSelect;
