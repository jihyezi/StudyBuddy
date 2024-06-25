import React, { useState } from "react";
import styles from "./InputSelect.module.css";
import "fonts/Font.css";

// icon
import down from "assets/icons/Post/down.png";

const InputSelect = (props) => {
  const classfications = [
    { name: "사업관리" },
    { name: "경영/회계/사무" },
    { name: "금융/보험" },
    { name: "교육/자연/과학/사회과학" },
    { name: "법률/경찰/소방/교도/국방" },
    { name: "보건/의료" },
    { name: "사회복지/종교" },
    { name: "문화/예술/디자인/방송" },
    { name: "운전/운송" },
    { name: "영업/판매" },
    { name: "경비/청소" },
    { name: "이용/숙박/여행/오락/스포츠" },
    { name: "음식서비스" },
    { name: "건설" },
    { name: "광업자원" },
    { name: "기계" },
    { name: "재료" },
    { name: "화학" },
    { name: "섬유/의복" },
    { name: "전기/전자" },
    { name: "정보통신" },
    { name: "식품/가공" },
    { name: "인쇄/목재/가구/공예" },
    { name: "농림어업" },
    { name: "안전관리" },
    { name: "환경/에너지" },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(props.placeholder);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className={styles.inputContainer}>
      <div className={styles.inputTitle}>{props.title}</div>
      <div
        className={`${styles.inputClick} ${
          isOpen ? styles.inputClickIsOpen : ""
        }`}
        onClick={handleClick}
      >
        <span className={styles.inputPlaceholder}>{selectedOption}</span>
        <img className={styles.inputIcon} src={down} alt="inputIcon" />
        {isOpen && (
          <div className={styles.dropdown}>
            {classfications.map((classfication, index) => {
              return (
                <div
                  className={styles.dropdownOption}
                  onClick={() => handleOptionClick(classfication.name)}
                >
                  {classfication.name}
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
