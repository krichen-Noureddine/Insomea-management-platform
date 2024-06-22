import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ClientDetails from '@/components/ClientDetails';
import AdditionalDetails from '@/components/AdditionalClientDetails';
import { Box, Tabs, Tab, CircularProgress, Typography } from '@mui/material';

const ClientDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    const fetchClient = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/clients/${id}?action=getOrganizationDetails`);
        if (!res.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await res.json();
        setClient(data);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  if (loading) return <CircularProgress />;
  if (!client) return <Typography variant="h6">No client found</Typography>;

  return (
    <Box sx={{ width: '100%', typography: 'body1', bgcolor: '#182237', color: 'white' }}>
      <Tabs value={tabIndex} onChange={handleTabChange} centered>
        <Tab label="Client Details" sx={{ color: 'white' }} />
        <Tab label="Additional Details" sx={{ color: 'white' }} />
      </Tabs>
      <Box sx={{ p: 3 }}>
        {tabIndex === 0 && <ClientDetails client={client} />}
        {tabIndex === 1 && <AdditionalDetails client={client.organizationDetails} />}
      </Box>
    </Box>
  );
};

export default ClientDetail;
