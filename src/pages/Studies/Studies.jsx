import React, { useEffect, useState, useRef } from "react";
import styles from "./Studies.module.css";

// component
import Toptab from "components/Studies/Toptab";
import Header from "components/Header";

const Studies = ({}) => {
  return (
    <div className={styles.studycontainer}>
      <Header headerName={"Studies"} />
      <div className={styles.tabstyle}>
        <Toptab />
      </div>
    </div>
  );
};

export default Studies;
