// components/Navbar.js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Notifications as MUINotifications, Chat as MUIChat, Public as MUIPublic, Search as MUISearch } from "@mui/icons-material";
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
          <MUISearch />
          <input type="text" placeholder="Search..." className={styles.input} />
        </div>
        <div className={styles.icons}>
          <MUIChat fontSize="small" />
          <MUINotifications
            fontSize="small"
            onClick={handleNotificationClick}
            className={styles.clickableIcon}
            sx={{ color: isNotificationClicked ? 'blue' : 'black' }} // Change color based on state
          />
          <MUIPublic fontSize="small" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
