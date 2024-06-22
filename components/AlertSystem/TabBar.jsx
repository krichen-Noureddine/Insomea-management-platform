import React, { useEffect } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { useRouter } from 'next/router';

const TabBar = () => {
  const router = useRouter();
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    // Update the active tab based on the current route
    switch (router.pathname) {
      case '/reminder':
        setValue(0);
        break;
      case '/summary':
        setValue(1);
        break;
      case '/reminder/settings':
        setValue(2);
        break;
      case '/configuration':
        setValue(3);
        break;
      default:
        setValue(0);
    }
  }, [router.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        router.push('/reminder');
        break;
      case 1:
        router.push('/summary');
        break;
      case 2:
        router.push('/reminder/settings');
        break;
      case 3:
        router.push('/configuration');
        break;
      default:
        router.push('/alerts');
    }
  };

  return (
    <Box sx={{ bgcolor: '#182237', color: 'white' }}>
      <Tabs 
        value={value} 
        onChange={handleChange} 
        centered 
        TabIndicatorProps={{ style: { backgroundColor: 'white' } }} 
        textColor="inherit"
      >
        <Tab label="Alerts" sx={{ color: 'white' }} />
        <Tab label="Summary" sx={{ color: 'white' }} />
        <Tab label="Settings" sx={{ color: 'white' }} />
        <Tab label="Configuration" sx={{ color: 'white' }} />
      </Tabs>
    </Box>
  );
};

export default TabBar;
