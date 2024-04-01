import React from 'react';
import useAuthentication from '../utils/auth'; // Adjust the import path as necessary
import styles from "../styles/users.module.css"; // Adjust path as necessary
import Search from "../pages/Search/Search";
const UserRolesPage = () => {
    // Destructuring to extract only the needed piece of state
    const { enrichedAssignments } = useAuthentication();

    return (
        <div className={styles.container}>
            <div className={styles.tableWrapper}>
            <div className={styles.top}>
        <Search placeholder="Search for a user..." />
     
          <button className={styles.addButton}>Add New</button>
        
      </div>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Type</th>
                            <th>Role Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enrichedAssignments && enrichedAssignments.map((assignment, index) => (
                            <tr key={index}>
                                <td>{assignment.principalDisplayName}</td>
                                <td>{assignment.roleName}</td>
                                <td>{assignment.principalType}</td>
                                <td>{assignment.roleDescription}</td>
                                <td><button className={styles["action-btn"]}>Edit</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserRolesPage;
