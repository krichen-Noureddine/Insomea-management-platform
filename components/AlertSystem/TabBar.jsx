import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { useRouter } from 'next/router';

const TabBar = () => {
  const router = useRouter();
  const [value, setValue] = useState(0);

  useEffect(() => {
    // Log the current route to debug
    console.log('Current route:', router.pathname);

    // Update the active tab based on the current route
    switch (router.pathname) {
      case '/reminder':
        setValue(0);
        break;
      case '/reminder/summary':
        setValue(1);
        break;
      case '/reminder/settings':
        setValue(2);
        break;
      case '/configuration':
        setValue(3);
        break;
      default:
        setValue(0); // Default to 0 if route doesn't match
    }
  }, [router.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    // Use router.push() to change the route based on the tab selected
    switch (newValue) {
      case 0:
        router.push('/reminder');
        break;
      case 1:
        router.push('/reminder/summary');
        break;
      case 2:
        router.push('/reminder/settings');
        break;
      case 3:
        router.push('/configuration');
        break;
      default:
        router.push('/alerts'); // Default to '/alerts'
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
      </Tabs>
    </Box>
  );
};

export default TabBar;
