import React from 'react';
import styles from "../styles/navbar.module.css";

const NavBar = ({ activeComponent, setActiveComponent }) => {
    return (
        <div className={styles.buttonBar}>
            <button
                className={`${styles.button} ${activeComponent === 'combinedView' && styles.active}`}
                onClick={() => setActiveComponent('combinedView')}
            >
                Client Form and Table
            </button>
            <button
                className={`${styles.button} ${activeComponent === 'credentialsSetup' && styles.active}`}
                onClick={() => setActiveComponent('credentialsSetup')}
            >
                Client Credentials Setup
            </button>
        </div>
    );
};

export default NavBar;
