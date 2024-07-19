import { useRouter } from 'next/router';
import useAuthentication from '@/utils/auth';
import styles from '@/styles/noAccess.module.css'; // Make sure this path is correct
import { TbLock } from "react-icons/tb";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, accessToken, handleLogin } = useAuthentication();

  // Optional: Use useEffect for additional side effects related to authentication or routing
  // useEffect(() => {
  //   // Example: Redirect to login if not authenticated
  //   if (!isAuthenticated) {
  //     router.push('/login'); // Redirect to login page
  //   }
  // }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center' }}>
          <TbLock style={{ fontSize: '20rem' }} /> {/* Ensure TbLock is correctly imported and defined */}
          <p style={{ marginTop: '2px' }}>You do not have permission to view this page.</p>
          {/* Example: Add a login button or link */}
          {/* <button onClick={handleLogin}>Login</button> */}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
