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
        {/* Add additional meta tags or links to stylesheets/scripts */}
      </Head>

         

      <UserRolesPage></UserRolesPage>

      {/* Additional components or elements can be added here */}
    </div>
  );
};

export default Profile;
