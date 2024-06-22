import { useState } from 'react';
import Image from "next/image";
import MenuLink from "./menuLink";
import useAuthentication from '@/utils/auth';
import styles from "../styles/sidebar.module.css";
import {
  MdDashboard,
  MdSupervisedUserCircle,
  MdShoppingBag,
  MdAttachMoney,
  MdWork,
  MdAnalytics,
  MdPeople,
  MdOutlineSettings,
  MdHelpCenter,
  MdLogout,
  MdPersonOutline,
} from "react-icons/md";
import { FaUser } from "react-icons/fa";
const menuItems = [
  {
    
    list: [
     
      {
        title: "Dashboard",
        path: "/Dashboard",
        icon: <MdDashboard />,
      },
      
      {
        title: "Azure Subscriptions",
        path: "/Subscriptions",
        icon: <MdShoppingBag />,
      },
      {
        title: "Licences office 365",
        path: "/mo365",
        icon: <MdAttachMoney />,
      },
      {
        title: "Clients",
        path: "/clients",
        icon: <MdAttachMoney />,
      },
    ],
  },
  {
   
    list: [
      {
        title: "Calendar",
        path: "/calendar",
        icon: <MdWork />,
      },
      {
        title: "Reports",
        path: "/dashboard/reports",
        icon: <MdAnalytics />,
      },
      {
        title: "Teams",
        path: "/dashboard/teams",
        icon: <MdPeople />,
      },
    ],
  },
  {
   
    list: [
      {
        title: "Users",
        path: "/users",
        icon: <MdSupervisedUserCircle />,
      },
      {
        title: "Roles",
        path: "/Profile",
        icon: <MdDashboard />,
      },
      {
        title: "Settings",
        path: "/dashboard/settings",
        icon: <MdOutlineSettings />,
      },
      {
        title: "Help",
        path: "/dashboard/help",
        icon: <MdHelpCenter />,
      },
    ],
  },
];

const UserInfo = ({ name, title }) => (
  <div className={styles.user}>
    <FaUser className={styles.userImage} size={50} /> {/* Use FaUser icon instead of Image */}
    <div className={styles.userDetail}>
      <span className={styles.username}>{name}</span>
      <span className={styles.userTitle}>{title}</span>
    </div>
  </div>
);

const Sidebar = () => {
  const { isAuthenticated, account, login, logout } = useAuthentication();

  return (
    <div className={styles.container}>
       <div className={styles.logoContainer}>
        <Image src="/logo.png" alt="Logo" width={150} height={40} />
      </div>
      {!isAuthenticated && (
  <button className={styles.signIn} onClick={login}>
    Sign In
  </button>
)}


      {isAuthenticated && <UserInfo name={account?.name} title="Administrator" />}

      <ul className={styles.list}>
        {menuItems.map((cat) => (
          <li key={cat.title}>
            <span className={styles.cat}>{cat.title}</span>
            {cat.list.map((item) => (
              <MenuLink item={item} key={item.title} />
            ))}
          </li>
        ))}
      </ul>

      {isAuthenticated && (
        <form onSubmit={logout}>
          <button type="submit" className={styles.logout}>
            <MdLogout />
            Logout
          </button>
        </form>
      )}
    </div>
  );
};

export default Sidebar;