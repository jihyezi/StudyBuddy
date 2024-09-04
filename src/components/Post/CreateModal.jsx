import React from "react";
import styles from "./CreateModal.module.css";

const CreateModal = ({ onCreate, onCancel }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.deleteModal}>
        <div className={styles.modalQuestion}>Create Community?</div>
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
