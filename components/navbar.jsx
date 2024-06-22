// components/Navbar.js
"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { MdNotifications, MdOutlineChat, MdPublic, MdSearch } from "react-icons/md";
import { useNotification } from "./Notification";
import styles from "../styles/navbar.module.css";

const Navbar = () => {
  const pathname = usePathname();
  const { addNotification, toggleNotificationPane } = useNotification();

  // Add a static notification on component mount
 

  return (
    <div className={styles.container}>
      <div className={styles.title}>{pathname.split("/").pop()}</div>
      <div className={styles.menu}>
        <div className={styles.search}>
          <MdSearch />
          <input type="text" placeholder="Search..." className={styles.input} />
        </div>
        <div className={styles.icons}>
          <MdOutlineChat size={20} />
          <MdNotifications size={20} onClick={toggleNotificationPane} className={styles.clickableIcon} />
          <MdPublic size={20} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
