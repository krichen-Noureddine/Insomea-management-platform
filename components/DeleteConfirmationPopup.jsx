import styles from"../styles/popup.module.css"
export const DeleteConfirmationPopup = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;
  
    return (
      <div className={styles.popupOverlay}>
        <div className={styles.popup}>
          <h2>Confirm Deletion</h2>
          <p>Are you sure you want to delete </p>
          <button onClick={onConfirm} className={styles.confirmButton}>Delete</button>
          <button onClick={onClose} className={styles.cancelButton}>Cancel</button>
        </div>
      </div>
    );
  };
  