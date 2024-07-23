import React from 'react';
import { useState } from 'react';
import Image from "next/image";
import MenuLink from "./menuLink";
import useAuthentication from '../utils/auth';
import styles from "../styles/sidebar.module.css";
import {
  MdDashboard,
  MdSupervisedUserCircle,
  MdShoppingBag,
  MdAttachMoney,
  MdWork,
  MdAnalytics,

  MdOutlineSettings,
  MdHelpCenter,
  MdLogout,
} from "react-icons/md";
import { HiBellAlert } from "react-icons/hi2";
import { GrLicense } from "react-icons/gr";
import { FaUsers } from "react-icons/fa6";
import { FaSignInAlt } from 'react-icons/fa';
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
        icon: <GrLicense />,
      },
      {
        title: "Clients",
        path: "/clients",
        icon: <FaUsers />,
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
        title: "Reminder",
        path: "/reminder",
        icon: <HiBellAlert />,
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
    <FaUser className={styles.userImage} size={50} />
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
          <FaSignInAlt className={styles.signInIcon} />
        </button>
      )}

      {isAuthenticated && <UserInfo name={account?.name} title="Administrator" />}

      <ul className={styles.list}>
        {menuItems.map((cat, catIndex) => (
          <li key={`category-${catIndex}`}>
            <span className={styles.cat}>{cat.title}</span>
            {cat.list.map((item, itemIndex) => (
              <MenuLink item={item} key={`item-${catIndex}-${itemIndex}`} />
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
