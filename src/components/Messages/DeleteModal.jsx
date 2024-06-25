import React, { useEffect, useState, useRef } from "react";
import styles from "./DeleteModal.module.css";
import "fonts/Font.css";

const DeleteModal = ({}) => {
  return (
    <div className={styles.deleteModal}>
      <div className={styles.modalQuestion}>Delete Conversation?</div>
      <div className={styles.modalConfirm}>Delete</div>
      <div className={styles.modalCancel}>cancel</div>
    </div>
  );
};
export default DeleteModal;
