import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, MenuItem, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, IconButton, Grid, Tooltip } from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import TabBar from '@/components/AlertSystem/TabBar';
import styles from '@/styles/AlertPage.module.css';

const SettingsPage = () => {
  const [emails, setEmails] = useState(['']);
  const [azureAlertTypes, setAzureAlertTypes] = useState({
    highUsage: { enabled: true, frequency: 'daily' },
    lowUsage: { enabled: true, frequency: 'daily' },
    closeExpiration: { enabled: true, frequency: 'weekly' },
    budgetExceeding: { enabled: true, frequency: 'daily' },
    costAnomalies: { enabled: true, frequency: 'immediate' },
  });
  const [mo365AlertTypes, setMo365AlertTypes] = useState({
    licenseExpiration: { enabled: true, frequency: 'weekly' },
    inactiveAccounts: { enabled: true, frequency: 'weekly' },
  });

  const handleEmailChange = (index, e) => {
    const newEmails = [...emails];
    newEmails[index] = e.target.value;
    setEmails(newEmails);
  };

  const handleAddEmail = () => {
    setEmails([...emails, '']);
  };

  const handleRemoveEmail = (index) => {
    const newEmails = emails.filter((_, i) => i !== index);
    setEmails(newEmails);
  };

  const handleAlertTypeChange = (type, alert, key, value) => {
    const newAlertTypes = type === 'azure' ? { ...azureAlertTypes } : { ...mo365AlertTypes };
    newAlertTypes[alert] = { ...newAlertTypes[alert], [key]: value };
    type === 'azure' ? setAzureAlertTypes(newAlertTypes) : setMo365AlertTypes(newAlertTypes);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Settings saved', { emails, azureAlertTypes, mo365AlertTypes });
  };

  return (
    <div className={styles.container}>
      <TabBar />
      <Box sx={{ mt: 3, bgcolor: 'white', color: 'black', p: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box mb={3}>
            {emails.map((email, index) => (
              <Box key={index} display="flex" alignItems="center" mb={2}>
                <TextField
                  fullWidth
                  label={`Email Address ${index + 1}`}
                  variant="outlined"
                  value={email}
                  onChange={(e) => handleEmailChange(index, e)}
                  required
                  sx={{
                    input: { color: 'black' },
                    label: { color: 'black' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'black' },
                      '&:hover fieldset': { borderColor: 'black' },
                      '&.Mui-focused fieldset': { borderColor: 'black' },
                    },
                  }}
                />
                <IconButton onClick={() => handleRemoveEmail(index)} sx={{ color: 'black' }}>
                  <RemoveIcon />
                </IconButton>
              </Box>
            ))}
            <Button onClick={handleAddEmail} variant="outlined" color="primary" startIcon={<AddIcon />}>
              Add Email
            </Button>
          </Box>

          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ color: 'black' }}>Azure Alert Types</FormLabel>
                <FormGroup>
                  {Object.keys(azureAlertTypes).map((alert) => (
                    <Box key={alert} display="flex" alignItems="center" mb={2}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={azureAlertTypes[alert].enabled}
                            onChange={(e) => handleAlertTypeChange('azure', alert, 'enabled', e.target.checked)}
                            name="enabled"
                            sx={{ color: 'black' }}
                          />
                        }
                        label={alert.replace(/([A-Z])/g, ' $1').trim()}
                      />
                      <Tooltip title={
                        alert === 'immediate' ? 'Receive alerts as soon as they are triggered.' :
                        alert === 'daily' ? 'Receive a summary of all alerts once a day.' :
                        'Receive a summary of all alerts once a week.'
                      }>
                        <TextField
                          select
                          value={azureAlertTypes[alert].frequency}
                          onChange={(e) => handleAlertTypeChange('azure', alert, 'frequency', e.target.value)}
                          variant="outlined"
                          name="frequency"
                          sx={{
                            ml: 2,
                            minWidth: 120,
                            maxWidth: 200,
                            input: { color: 'black' },
                            label: { color: 'black' },
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: 'black' },
                              '&:hover fieldset': { borderColor: 'black' },
                              '&.Mui-focused fieldset': { borderColor: 'black' },
                            },
                          }}
                        >
                          <MenuItem value="immediate">Immediate</MenuItem>
                          <MenuItem value="daily">Daily Digest</MenuItem>
                          <MenuItem value="weekly">Weekly Summary</MenuItem>
                        </TextField>
                      </Tooltip>
                    </Box>
                  ))}
                </FormGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ color: 'black' }}>MO365 Alert Types</FormLabel>
                <FormGroup>
                  {Object.keys(mo365AlertTypes).map((alert) => (
                    <Box key={alert} display="flex" alignItems="center" mb={2}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={mo365AlertTypes[alert].enabled}
                            onChange={(e) => handleAlertTypeChange('mo365', alert, 'enabled', e.target.checked)}
                            name="enabled"
                            sx={{ color: 'black' }}
                          />
                        }
                        label={alert.replace(/([A-Z])/g, ' $1').trim()}
                      />
                      <Tooltip title={
                        alert === 'immediate' ? 'Receive alerts as soon as they are triggered.' :
                        alert === 'daily' ? 'Receive a summary of all alerts once a day.' :
                        'Receive a summary of all alerts once a week.'
                      }>
                        <TextField
                          select
                          value={mo365AlertTypes[alert].frequency}
                          onChange={(e) => handleAlertTypeChange('mo365', alert, 'frequency', e.target.value)}
                          variant="outlined"
                          name="frequency"
                          sx={{
                            ml: 2,
                            minWidth: 120,
                            maxWidth: 200,
                            input: { color: 'black' },
                            label: { color: 'black' },
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { borderColor: 'black' },
                              '&:hover fieldset': { borderColor: 'black' },
                              '&.Mui-focused fieldset': { borderColor: 'black' },
                            },
                          }}
                        >
                          <MenuItem value="immediate">Immediate</MenuItem>
                          <MenuItem value="daily">Daily Digest</MenuItem>
                          <MenuItem value="weekly">Weekly Summary</MenuItem>
                        </TextField>
                      </Tooltip>
                    </Box>
                  ))}
                </FormGroup>
              </FormControl>
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="outlined"
            size="large"
            sx={{
              color: '#182237',
              borderColor: '#182237',
              '&:hover': {
                borderColor: '#182237',
                backgroundColor: 'rgba(24, 34, 55, 0.04)',
              },
            }}
          >
            Save Settings
          </Button>
        </form>
      </Box>
    </div>
  );
};

export default SettingsPage;
