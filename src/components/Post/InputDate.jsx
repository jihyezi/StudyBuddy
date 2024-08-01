import React, { useState } from "react";
import styles from "./InputDate.module.css";
import "fonts/Font.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import down from "assets/icons/Post/down.png";

const InputDate = (props) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsOpen(false);
    props.onDateChange(date);
  };

  const formatDate = (date) => {
    if (!date) return props.placeholder;
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
  };

  const placeholderStyle = {
    color: selectedDate ? "#808080" : "#b6b6b6",
  };

  return (
    <div className={styles.inputContainer}>
      <div className={styles.inputTitle}>{props.title}</div>
      <div className={styles.inputClick} onClick={handleClick}>
        <span className={styles.inputPlaceholder} style={placeholderStyle}>
          {formatDate(selectedDate)}
        </span>
        <img className={styles.inputIcon} src={down} alt="inputIcon" />
      </div>
      {isOpen && (
        <div className={styles.datePickerContainer}>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            inline
            className={styles.datePicker}
          />
        </div>
      )}
    </div>
  );
};

export default InputDate;
