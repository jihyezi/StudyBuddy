import React from "react";
import styles from "./DeleteModal.module.css";

const DeleteModal = ({ onDelete, onCancel }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.deleteModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalQuestion}>Delete Conversation?</div>
        <div className={styles.modalConfirm} onClick={onDelete}>
          Delete
        </div>
        <div className={styles.modalCancel} onClick={onCancel}>
          Cancel
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
