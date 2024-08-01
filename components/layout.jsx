// components/Layout.js
import React from 'react';
import Navbar from './navbar';
import Sidebar from './sidebar';
import { useNotification } from "./Notification";
import styles from "../styles/dashboard.module.css";

const Layout = ({children}) => {
  const { showNotificationPane } = useNotification();

  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <Sidebar />
      </div>
      <div className={`${styles.content} ${showNotificationPane ? styles.shifted : ''}`}>
        <Navbar />
        {children}
      </div>
    </div>
  );
}

export default Layout;
