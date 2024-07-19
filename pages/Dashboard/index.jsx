// pages/DashboardPage.js
import Head from 'next/head';

const DashboardPage = () => {
  return (
    <>
   
      <div>
        <iframe
          title="MP"
          width="1390"
          height="541.25"
          src="https://app.powerbi.com/reportEmbed?reportId=6d299bae-1a92-4669-a466-4b64da092498&autoAuth=true&ctid=b5ddb5f6-c713-48e9-a93d-d9fa7d6d6ae8"
          frameBorder="188"
        ></iframe>
      </div>
      <style jsx>{`
        .container {
          margin: 20px;
          display: flex;
          justify-content: center;
        }
      `}</style>
    </>
  );
};

export default DashboardPage;
