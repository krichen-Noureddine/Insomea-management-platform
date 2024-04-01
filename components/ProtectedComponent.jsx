import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useAuthentication from '../utils/auth';

const ProtectedComponent = () => {
  const { isAuthenticated } = useAuthentication();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      // Instead of calling login, redirect to a public page or show an informational component
      // Example: Redirect to the homepage or a specific public page
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    // Optionally, show a message or a generic "Unauthorized Access" component while redirecting
    return <div>Unauthorized access. Redirecting...</div>;
  }

  return (
    <div>
      {/* Protected content goes here */}
    </div>
  );
};

export default ProtectedComponent;