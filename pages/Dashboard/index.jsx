// pages/dashboard/index.jsx
import Head from 'next/head';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the PowerBIEmbed component, ensuring it is client-side only
const PowerBIEmbed = dynamic(() => import('../../components/PowerBIEmbed'), { ssr: false });

const Dashboard = () => {
  const [embedUrl, setEmbedUrl] = useState('');
  const [reportId, setReportId] = useState('55144d1f-a773-4e79-baf6-225f17d2034d');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const fetchEmbedConfig = async () => {
      try {
        const res = await fetch('/api/getEmbedUrl');
        const data = await res.json();
        setEmbedUrl(data.embedUrl);
        console.log('Embed URL fetched:', data.embedUrl);
      } catch (error) {
        console.error('Error fetching embed URL:', error);
      }
    };

    fetchEmbedConfig();
  }, []);

  return (
    <div>
      <Head>
        <title>Dashboard</title>
      </Head>
      <h1>Power BI Dashboard</h1>
      {isClient && embedUrl && reportId ? (
        <PowerBIEmbed reportId={reportId} embedUrl={embedUrl} />
      ) : (
        <p>Loading...</p>
      )}
      {/* Additional components or elements can be added here */}
    </div>
  );
};

export default Dashboard;
