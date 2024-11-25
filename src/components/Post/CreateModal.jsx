import React from "react";
import styles from "./CreateModal.module.css";

const CreateModal = ({ onCreate, onCancel, title }) => {
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.deleteModal}>
        <div className={styles.modalQuestion}>Create {title}?</div>
        <div className={styles.modalConfirm} onClick={onCreate}>
          Create
        </div>
        <div className={styles.modalCancel} onClick={onCancel}>
          Cancel
        </div>
      </div>
    </div>
  );
};

export default CreateModal;
