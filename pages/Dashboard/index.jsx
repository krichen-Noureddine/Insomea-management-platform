import Head from 'next/head';

export default function Dashboard() {
  
  return (
    <div>
      <Head>
        <title>Dashboard - Your Application Name</title>
        <meta name="description" content="Welcome to the dashboard!" />
        {/* Add additional meta tags or links to stylesheets/scripts */}
      </Head>

      <h1>Dashboard</h1>
      <p>Welcome to the dashboard!</p>

      {/* Additional components or elements can be added here */}
    </div>
  );
}
