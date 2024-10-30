import React from "react";
import styles from "./DeleteModal.module.css";

const DeleteModal = ({ onClose, onDelete }) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.deleteModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalQuestion}>Delete Conversation?</div>
        <div
          className={styles.modalConfirm}
          onClick={() => {
            onDelete();
            onClose();
          }}
        >
          Delete
        </div>
        <div className={styles.modalCancel} onClick={onClose}>
          Cancel
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
