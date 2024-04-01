import { useEffect } from 'react';
import useAuthentication from '../utils/auth'; // Import the useAuthentication hook
import styles from "../styles/users.module.css"; // Import styles
const UsersData = () => {
  const { userProfiles, getAllUserProfiles } = useAuthentication();

  useEffect(() => {
    getAllUserProfiles(); // Fetch user profiles when component mounts
  }, []); 

  return (
    <div className={styles.container}> {/* Apply container styles */}
      
      {userProfiles ? (
        <div className={styles.tableWrapper}> {/* Add a wrapper for table overflow */}
          <table className={styles.table}> {/* Apply table styles */}
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                
              </tr>
            </thead>
            <tbody>
              {userProfiles.value.map(user => (
                <tr key={user.id}>
                  <td>{user.displayName}</td> {/* Assuming user's display name is available */}
                  <td>{user.mail}</td> {/* Assuming user's email is available */}
                  {/* Add logic to determine user role based on your data */}
                  <td>{/* user role logic */}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UsersData;
