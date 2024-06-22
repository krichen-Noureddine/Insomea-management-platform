import React, { createContext, useContext, useState, useCallback } from 'react';
import styles from '@/styles/notif.module.css';

const NotificationContext = createContext();

export const useNotification = () => {
  return useContext(NotificationContext);
};

const NotificationPane = ({ show, notifications, clearAll, removeNotification }) => {
  return (
    <div className={`${styles.notificationPane} ${show ? styles.show : ''}`}>
      <h2>
        Notifications
        <button onClick={clearAll}>Clear All</button>
      </h2>
      {notifications.length === 0 && <p>No notifications</p>}
      {notifications.map((notification, index) => (
        <div key={index} className={`${styles.notification} ${styles[notification.type]}`}>
          <button className={styles.closeBtn} onClick={() => removeNotification(index)}>×</button>
          <h3>{notification.title}</h3>
          <p>{notification.message}</p>
        </div>
      ))}
    </div>
  );
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotificationPane, setShowNotificationPane] = useState(false);

  const addNotification = useCallback((title, message, type) => {
    setNotifications(prevNotifications => [...prevNotifications, { title, message, type }]);
    setShowNotificationPane(true);
  }, []);

  const clearAll = () => {
    setNotifications([]);
  };

  const removeNotification = (index) => {
    setNotifications(prevNotifications => prevNotifications.filter((_, i) => i !== index));
  };

  const toggleNotificationPane = () => {
    setShowNotificationPane(prevState => !prevState);
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, toggleNotificationPane, showNotificationPane }}>
      {children}
      <NotificationPane
        show={showNotificationPane}
        notifications={notifications}
        clearAll={clearAll}
        removeNotification={removeNotification}
      />
    </NotificationContext.Provider>
  );
};
