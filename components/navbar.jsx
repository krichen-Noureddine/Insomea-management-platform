// components/Navbar.js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MdNotifications, MdOutlineChat, MdPublic, MdSearch } from "react-icons/md";
import { useNotification } from "./Notification";
import styles from "../styles/navbar.module.css";

const Navbar = () => {
  const router = useRouter();
  const { addNotification, toggleNotificationPane } = useNotification();
  const [isNotificationClicked, setNotificationClicked] = useState(false);

  useEffect(() => {}, [addNotification]);

  const pageTitle = router.pathname.split("/").pop() || "Home";

  const handleNotificationClick = () => {
    toggleNotificationPane();
    setNotificationClicked(!isNotificationClicked);
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>{pageTitle}</div>
      <div className={styles.menu}>
        <div className={styles.search}>
          <MdSearch />
          <input type="text" placeholder="Search..." className={styles.input} />
        </div>
        <div className={styles.icons}>
          <MdOutlineChat size={20} />
          <MdNotifications
            size={20}
            onClick={handleNotificationClick}
            className={styles.clickableIcon}
            style={{ color: isNotificationClicked ? 'blue' : 'black' }} // Change color based on state
          />
          <MdPublic size={20} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
