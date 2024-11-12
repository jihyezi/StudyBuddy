import React, { useEffect, useState, useRef } from "react";
import styles from "./Studies.module.css";

// component
import Toptab from "components/Studies/Toptab";
import Header from "components/Header";

const Studies = ({ studyData, userData, allUserData, isLoading }) => {
  return (
    <div className={styles.studycontainer}>
      <Header headerName={"Studies"} />
      <div className={styles.tabstyle}>
        <Toptab
          studyData={studyData}
          userData={userData}
          allUserData={allUserData}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Studies;
