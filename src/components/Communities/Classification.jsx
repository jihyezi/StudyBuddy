import React, { useEffect, useState, useRef } from "react";
import styles from "./Classification.module.css";
import "fonts/Font.css";

const Classification = ({}) => {
  return (
    <>
      {/* 클릭한 분류 */}
      <div className={styles.classificationOn}>🔥</div>

      {/* 클릭하지 않은 분류 */}
      <div className={styles.classificationOff}>경영/회계/사무</div>
    </>
  );
};
export default Classification;
