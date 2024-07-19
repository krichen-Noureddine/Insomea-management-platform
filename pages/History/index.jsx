import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { DateRangePicker } from 'rsuite';
import { subDays, startOfDay, endOfDay } from 'date-fns';
import styles from "@/styles/Historique.module.css";

const HistoriquePage = ({ historiqueRecords, error }) => {
  const [filters, setFilters] = useState({
    companyName: '',
    subscriptionName: '',
    startDate: '',
    endDate: '',
    clientId: '' // Added clientId here
  });
  const [companyNames, setCompanyNames] = useState([]);
  const [subscriptionNames, setSubscriptionNames] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [sortCriteria, setSortCriteria] = useState('');

  const predefinedRanges = [
    {
      label: 'Today',
      value: [startOfDay(new Date()), endOfDay(new Date())],
    },
    {
      label: 'Yesterday',
      value: [startOfDay(subDays(new Date(), 1)), endOfDay(subDays(new Date(), 1))],
    },
    {
      label: 'Last 7 Days',
      value: [startOfDay(subDays(new Date(), 6)), endOfDay(new Date())],
    },
    {
      label: 'This Month',
      value: [startOfDay(new Date(new Date().getFullYear(), new Date().getMonth(), 1)), endOfDay(new Date())],
    },
  ];

  useEffect(() => {
    fetchCompanyNames();
  }, []);

  useEffect(() => {
    console.log('filters.clientId changed:', filters.clientId);
    if (filters.clientId) {
      fetchSubscriptionNames(filters.clientId);
    } else {
      setSubscriptionNames([]);
    }
  }, [filters.clientId]);
  

  useEffect(() => {
    if (!filters.companyName || !filters.subscriptionName) {
      setFilteredRecords([]);
    } else {
      fetchHistoriqueRecords();
    }
  }, [filters]);

  useEffect(() => {
    if (filteredRecords.length > 0 && sortCriteria) {
      const sortedRecords = [...filteredRecords].sort((a, b) => {
        if (sortCriteria === 'date') {
          return new Date(a.date) - new Date(b.date);
        } else if (sortCriteria === 'cost') {
          return parseFloat(a.cost) - parseFloat(b.cost);
        } else if (sortCriteria === 'usage') {
          return parseFloat(a.usage) - parseFloat(b.usage);
        }
        return 0;
      });
      setFilteredRecords(sortedRecords);
    }
  }, [sortCriteria, filteredRecords]);

  const fetchCompanyNames = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/clients');
      
      const names = response.data.map(company => ({
        label: company.companyName,
        value: company.companyName,
        clientId: company._id // Ensure clientId is included
      }));
      console.log('Company names fetched:', names);
  
      setCompanyNames(names || []);
  
      if (names.length > 0 && !filters.companyName) {
        const firstCompany = names[0];
        setFilters(prevFilters => ({
          ...prevFilters,
          companyName: firstCompany.value,
          clientId: firstCompany.clientId // Set clientId here
        }));
      }
    } catch (error) {
      console.error('Error fetching company names:', error);
    }
  };
  
  const fetchSubscriptionNames = async (clientId) => {
    try {
      console.log('Fetching subscription names for clientId:', clientId);
      const response = await axios.get('http://localhost:3000/api/azure', {
        params: { clientId }
      });
      console.log('API Response:', response.data);
  
      // Process the response data
      const names = response.data.map(subscription => ({
        label: subscription.subscriptionName,
        value: subscription.subscriptionName
      }));
      console.log('Subscription names fetched:', names);
  
      setSubscriptionNames(names || []);
  
      // Set the first subscription as the default filter if available
      if (names.length > 0) {
        setFilters(prevFilters => ({
          ...prevFilters,
          subscriptionName: names[0].value,
        }));
      }
    } catch (error) {
      console.error('Error fetching subscription names:', error);
    }
  };
  
  

  const fetchHistoriqueRecords = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/historique', {
        params: filters,
      });
      const { historiqueRecords } = response.data;
      setFilteredRecords(historiqueRecords || []);
    } catch (error) {
      console.error('Error fetching historique data:', error);
      setFilteredRecords([]);
    }
  };

  const handleFilterChange = (selectedOption, actionMeta) => {
    const { name } = actionMeta;
    const value = selectedOption ? selectedOption.value : '';

    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
      clientId: name === 'companyName' ? selectedOption?.clientId || '' : prevFilters.clientId // Update clientId based on company selection
    }));
  };

  const handleDateChange = (range) => {
    setDateRange(range);
    setFilters(prevFilters => ({
      ...prevFilters,
      startDate: range[0] ? range[0].toISOString() : '',
      endDate: range[1] ? range[1].toISOString() : '',
    }));
  };

  const handleExportCSV = async () => {
    try {
      const response = await axios.post('api/exportCSV', {
        filters
      });

      if (response.data && response.data.csvUrl) {
        const csvLink = document.createElement('a');
        csvLink.href = response.data.csvUrl;
        csvLink.setAttribute('download', `${filters.companyName}-${filters.subscriptionName}.csv`);
        document.body.appendChild(csvLink);
        csvLink.click();
        document.body.removeChild(csvLink);
        console.log('CSV exported successfully:', response.data);
      } else {
        console.error('Error exporting CSV: Invalid response from server');
      }
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  const handleSortChange = (selectedOption) => {
    setSortCriteria(selectedOption ? selectedOption.value : '');
  };

  const calculateTotalCost = () => {
    return filteredRecords.reduce((total, record) => total + parseFloat(record.cost), 0).toFixed(2);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'cost', label: 'Cost' },
    { value: 'usage', label: 'Usage' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.searchAndFilterBar}>
        <Select
          className={styles.filterSelect1}
          name="companyName"
          value={companyNames.find(option => option.value === filters.companyName)}
          onChange={handleFilterChange}
          options={companyNames}
          isClearable
          placeholder="Select Company Name"
        />

<Select
  className={styles.filterSelect1}
  name="subscriptionName"
  value={subscriptionNames.find(option => option.value === filters.subscriptionName)}
  onChange={handleFilterChange}
  options={subscriptionNames}
  isClearable
  isDisabled={!filters.clientId} // Disable if no clientId
  placeholder="Select Subscription"
/>


        <DateRangePicker
          className={`${styles.filterSelect1} `}
          value={dateRange}
          onChange={handleDateChange}
          placeholder="Select Date Range"
          ranges={predefinedRanges}
        />

        <Select
          className={styles.filterSelect1}
          name="sortBy"
          value={sortOptions.find(option => option.value === sortCriteria)}
          onChange={handleSortChange}
          options={sortOptions}
          isClearable
          placeholder="Sort By"
        />

        <button className={styles.pdfExportButton} onClick={handleExportCSV}>Export CSV</button>
      </div>

      <div className={styles.totalCostContainer}>
        <span>Total Cost: ${calculateTotalCost()}</span>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          
          <thead>
            <tr>
              <th>Service</th>
              <th>Date</th>
              <th>Resource Location</th>
              <th>Category</th>
              <th>Usage</th>
              <th>Cost</th>
              <th>Currency</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map(record => (
              
              <tr key={record._id} className={styles.tableRow}>
                <td>{record.service}</td>
                <td>{new Date(record.date).toLocaleDateString()}</td>
                <td>{record.resource_location}</td>
                <td>{record.category}</td>
                <td>{parseFloat(record.usage).toFixed(3)}</td>
                <td>{parseFloat(record.cost).toFixed(3)}</td>
                <td>{record.currency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoriquePage;
