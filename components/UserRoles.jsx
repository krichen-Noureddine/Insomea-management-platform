// import React from "react";
// import useAuthentication from "../utils/auth"; // Adjust the import path as necessary
// import styles from "../styles/users.module.css"; // Adjust path as necessary
// import Search from "../pages/Search/Search";

// const UserRolesPage = () => {
//     // Destructuring to extract only the needed piece of state
//     const { enrichedAssignments } = useAuthentication();

//     // Render table rows dynamically
//     const renderTableRows = () => {
//         if (!enrichedAssignments || enrichedAssignments.length === 0) {
//             return (
//                 <tr>
//                     <td colSpan="5" className={styles.noData}>
//                         No user roles found.
//                     </td>
//                 </tr>
//             );
//         }

//         return enrichedAssignments.map((user) => (
//             <tr key={user.id}>
//                 <td>{user.displayName || "N/A"}</td>
//                 <td>
//                     {user.roles && user.roles.length > 0
//                         ? user.roles.map((role) => role.roleInfo?.displayName || "N/A").join(", ")
//                         : "No roles assigned"}
//                 </td>
//                 <td>
//                     {user.roles && user.roles.length > 0
//                         ? user.roles.map((role) => role.principalType || "N/A").join(", ")
//                         : "N/A"}
//                 </td>
//                 <td>
//                     {user.roles && user.roles.length > 0
//                         ? user.roles.map((role) => role.roleInfo?.description || "No description").join(", ")
//                         : "No description available"}
//                 </td>
//                 <td>
//                     <button
//                         className={styles.actionButton}
//                         onClick={() => handleUserAction(user.id)}
//                     >
//                         Manage
//                     </button>
//                 </td>
//             </tr>
//         ));
//     };

//     // Handler for user actions (e.g., Manage button)
//     const handleUserAction = (userId) => {
//         console.log(`Manage action clicked for user ID: ${userId}`);
//         // Add functionality for managing users
//     };

//     return (
//         <div className={styles.container}>
//             <div className={styles.tableWrapper}>
//                 <div className={styles.top}>
//                     <Search placeholder="Search for a user..." />
//                     <button className={styles.addButton}>Add New</button>
//                 </div>
//                 <table className={styles.table}>
//                     <thead>
//                         <tr>
//                             <th>Username</th>
//                             <th>Role</th>
//                             <th>Type</th>
//                             <th>Role Description</th>
//                             <th>Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>{renderTableRows()}</tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default UserRolesPage;
import React from "react";
import styles from "../styles/users.module.css"; // Adjust path as necessary
import Search from "../pages/Search/Search";

const UserRolesPage = () => {
    // Static user roles data
    const staticUserRoles = [
        {
            id: 1,
            displayName: "Amine Gongi",
            role: "Administrator",
            type: "Internal",
            description: "Has full access to all system features",
        },
        {
            id: 2,
            displayName: "Noureddine Krichen",
            role: "IT Manager",
            type: "Internal",
            description: "IT Manager",
        },
    ];

    // Render table rows dynamically from static data
    const renderTableRows = () => {
        return staticUserRoles.map((user) => (
            <tr key={user.id}>
                <td>{user.displayName}</td>
                <td>{user.role}</td>
                <td>{user.type}</td>
                <td>{user.description}</td>
             
            </tr>
        ));
    };

    // Handler for user actions (e.g., Manage button)
    const handleUserAction = (userId) => {
        console.log(`Manage action clicked for user ID: ${userId}`);
        // Add functionality for managing users
    };

    return (
        <div className={styles.container}>
            <div className={styles.tableWrapper}>
                <div className={styles.top}>
                    <Search placeholder="Search for a user..." />
                </div>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Type</th>
                            <th>Role Description</th>
                        </tr>
                    </thead>
                    <tbody>{renderTableRows()}</tbody>
                </table>
            </div>
        </div>
    );
};

export default UserRolesPage;
