import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import styles from '@/styles/LoadingSpinner.module.css'; // Create a CSS module for spinner styles

const LoadingSpinner = () => {
    return (
        <div className={styles.spinnerContainer}>
            <FontAwesomeIcon icon={faSpinner} spin className={styles.spinner} />
        </div>
    );
};

export default LoadingSpinner;
