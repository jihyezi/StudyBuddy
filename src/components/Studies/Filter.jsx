import React, { useEffect, useRef, useState } from "react";
import styles from "./Filter.module.css";
import "fonts/Font.css";
import { selectList } from "../Post/SelectList";

// icon
import down from "assets/icons/Post/down.png";

const Filter = ({ placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(placeholder);
    const inputRef = useRef(null);

    // 고정된 옵션 목록
    const selectOptions = selectList?.classifications || [];

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
        color: selectedOption === placeholder ? "#b6b6b6" : "#808080",
    };

    return (
        <div className={styles.inputContainer} ref={inputRef}>
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
                        {selectOptions.map((option, index) => (
                            <div
                                key={index}
                                className={styles.dropdownOption}
                                onClick={() => handleOptionClick(option.name)}
                            >
                                {option.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Filter;