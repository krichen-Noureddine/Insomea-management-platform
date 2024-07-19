// pages/profile.js
import Head from 'next/head';
import UserData from '../../components/userData';
import UserRolesPage from '@/components/UserRoles';
const Profile = () => {
  return (
    <div>
      <Head>
        <title>Profile - Your Application Name</title>
        <meta name="description" content="Welcome to your profile!" />
      </Head>

         

      <UserRolesPage></UserRolesPage>

    </div>
  );
};

export default Profile;
