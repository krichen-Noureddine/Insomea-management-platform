// pages/DashboardPage.js
import Head from 'next/head';

const DashboardPage = () => {
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>

      <div className="iframe-container">
      <iframe
  title="MP"
  src="https://app.powerbi.com/reportEmbed?reportId=55144d1f-a773-4e79-baf6-225f17d2034d&autoAuth=true&ctid=b5ddb5f6-c713-48e9-a93d-d9fa7d6d6ae8"
  allowFullScreen={true}
  style={{
    height: '618px',
     width: '1252px',
    position: 'absolute',
    left: '200px',
    outline: 'none',
  }}
></iframe>

      </div>

      <style jsx>{`
        .iframe-container {
          width: 100vw;
          height: 100vh;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden; /* Ensure no scroll bar for the container */
        }

        iframe {
          width: 100%;
          height: 100%;
          border: none;
          overflow: hidden; /* Prevent scroll bar inside the iframe */
        }
      `}</style>
    </>
  );
};

export default DashboardPage;
