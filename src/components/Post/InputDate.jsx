import React, { useState } from "react";
import styles from "./InputDate.module.css";
import { styled } from "styled-components";
import "fonts/Font.css";
import { getMonth, getYear } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// icon
import down from "assets/icons/Post/down.png";
import left from "assets/icons/Post/chevron_left.png";
import right from "assets/icons/Post/chevron_right.png";

const DatepickerWrapper = styled.div`
  position: absolute;
  top: 27%;
  z-index: 1000;

  .react-datepicker {
    padding: 16px;

    .react-datepicker__header {
      background-color: #fff;
      color: #fff;
      border-bottom: none;
      border-radius: 0;
    }

    .react-datepicker__month-container {
      // padding-bottom: 16px;
      // margin-bottom: 8px;
      // border-bottom: 1px solid #d4d6dd;

      .react-datepicker__day-names {
        width: 280px;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;

        .react-datepicker__day-name {
          display: flex;
          width: 40px;
          height: 40px;
          justify-content: center;
          align-items: center;
        }
      }

      .react-datepicker__current-month {
        float: left;
      }

      .react-datepicker__month {
        margin: 0px;
      }

      .react-datepicker__week {
        width: 280px;
        display: flex;
        justify-content: space-around;

        > * {
          display: flex;
          width: 40px;
          height: 40px;
          justify-content: center;
          align-items: center;
          color: var(--neutral-dark-medium, #494a50);
          text-align: center;

          font-family: Inter;
          font-size: 12px;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
        }

        .react-datepicker__day {
          background-color: transparent;
        }

        .react-datepicker__day--today {
          background-color: ${(props) =>
    props.selectedDate ? "transparent" : "rgba(255, 116, 116, 0.2)"};
        }

        .react-datepicker__day:hover {
          background-color: rgba(255, 116, 116, 0.2);
        }

        .react-datepicker__day--selected {
          background: rgba(255, 116, 116, 0.2);
          background-color: #ff7474;
          display: flex;
          width: 40px;
          height: 40px;
          justify-content: center;
          align-items: center;
          color: #fff;
        }

        .react-datepicker__day--selected:hover {
          background-color: #ff7474;
        }
      }

      .react-datepicker__day--outside-month.react-datepicker__day--disabled {
        color: #b6b6b6;
        pointer-events: none;
      }
    }

    .react-datepicker__children-container {
      width: 300px;
    }
  }
`;

const InputDate = (props) => {
  const initialDate =
    typeof props.selectedDate === "string"
      ? new Date(props.selectedDate)
      : props.selectedDate || null;

  const [selectedDate, setSelectedDate] = useState(initialDate);
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

  const YEARS = Array.from(
    { length: getYear(new Date()) + 1 - 2000 },
    (_, i) => getYear(new Date()) - i
  );
  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div className={props.small ? styles.inputContainer2 : styles.inputContainer}>
      <div className={styles.inputTitle}>{props.title}</div>
      <div className={styles.inputClick} onClick={handleClick}>
        <span className={styles.inputPlaceholder} style={placeholderStyle}>
          {formatDate(selectedDate)}
        </span>
        <img className={styles.inputIcon} src={down} alt="inputIcon" />
      </div>
      {isOpen && (
        <DatepickerWrapper>
          <DatePicker
            formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 3)}
            showYearDropdown
            scrollableYearDropdown
            shouldCloseOnSelect
            yearDropdownItemNumber={100}
            minDate={props.minDate}
            maxDate={new Date()}
            selected={selectedDate}
            calendarClassName={styles.calenderWrapper}
            inline
            onChange={handleDateChange}
            renderCustomHeader={({
              date,
              changeYear,
              changeMonth,
              decreaseMonth,
              increaseMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled,
            }) => (
              <div className={styles.customHeaderContainer}>
                <div style={{ width: "34px" }}>
                  {!prevMonthButtonDisabled && (
                    <button
                      type="button"
                      onClick={decreaseMonth}
                      className={styles.monthButton}
                    >
                      <img className={styles.arrowIcon} src={left} alt="left" />
                    </button>
                  )}
                </div>
                <div>
                  <span className={styles.month}>{MONTHS[getMonth(date)]}</span>
                  <select
                    value={getYear(date)}
                    className={styles.year}
                    onChange={({ target: { value } }) => changeYear(+value)}
                  >
                    {YEARS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={increaseMonth}
                    className={styles.monthButton}
                    disabled={nextMonthButtonDisabled}
                  >
                    <img className={styles.arrowIcon} src={right} alt="right" />
                  </button>
                </div>
              </div>
            )}
          ></DatePicker>
        </DatepickerWrapper>
      )}
    </div>
  );
};

export default InputDate;
