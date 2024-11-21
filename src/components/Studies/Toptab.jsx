import React, { useState } from "react";
import styles from "./Toptab.module.css";
import All from "pages/Studies/All";
import Online from "pages/Studies/Online";
import Offline from "pages/Studies/Offline";

export const Toptab = () => {
  const [currentTab, clickTab] = useState(0);

  const menuArr = [
    {
      name: "전체",
      content: <All />,
    },
    {
      name: "온라인",
      content: <Online />,
    },
    {
      name: "오프라인",
      content: <Offline />,
    },
  ];

  const selectMenuHandler = (index) => {
    clickTab(index);
  };

  return (
    <div>
      <div className={styles.background}>
        <div className={styles.communityDetailClick}>
          {menuArr.map((el, index) => (
            <div
              key={index}
              className={styles.communityTab}
              onClick={() => selectMenuHandler(index)}
            >
              <span
                className={
                  index === currentTab
                    ? `${styles[`community${el.name}Post`]} ${styles.selected}`
                    : styles[`community${el.name}Post`]
                }
              >
                {el.name}
              </span>
              {index === currentTab && (
                <div className={styles.communityTabClick} />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.desc}>
        <p>{menuArr[currentTab].content}</p>
      </div>
    </div>
  );
};

export default Toptab;
