import { useRouter } from 'next/router';
import useAuthentication from '@/utils/auth';
import { Box, Typography } from '@mui/material';
import Lock from '@mui/icons-material/Lock';
import styles from '@/styles/noAccess.module.css'; // Ensure this path is correct

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, handleLogin } = useAuthentication();

  // Uncomment and adjust if you want to handle redirection based on authentication status
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push('/login'); // Redirect to login page
  //   }
  // }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <Box textAlign="center">
          <Lock sx={{ fontSize: '20rem' }} /> {/* Use Lock for the icon */}
          <Typography variant="h5" mt={2}>
            You do not have permission to view this page.
          </Typography>
          {/* Optional: Add a login button or link */}
          {/* <button onClick={handleLogin}>Login</button> */}
        </Box>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
