import { useRouter } from "next/router";
import { useEffect } from "react";
import { MdNotifications, MdOutlineChat, MdPublic, MdSearch } from "react-icons/md";
import { useNotification } from "./Notification";
import styles from "../styles/navbar.module.css";

const Navbar = () => {
  const router = useRouter();
  const { addNotification, toggleNotificationPane } = useNotification();

  useEffect(() => {
    addNotification("Welcome to the dashboard!");
  }, [addNotification]);

  const pageTitle = router.pathname.split("/").pop() || "Home";

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
          <MdNotifications size={20} onClick={toggleNotificationPane} className={styles.clickableIcon} />
          <MdPublic size={20} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
