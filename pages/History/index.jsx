import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { subDays, startOfDay, endOfDay } from 'date-fns';
import styles from "@/styles/Historique.module.css";
import { DateRangePicker } from 'rsuite';
//import 'rsuite/dist/rsuite.min.css';

const HistoriquePage = ({ historiqueRecords: initialRecords, companyNames: initialCompanyNames, error }) => {
  const [filters, setFilters] = useState({
    companyName: '',
    subscriptionName: '',
    startDate: '',
    endDate: '',
    clientId: ''
  });
  const [companyNames, setCompanyNames] = useState(initialCompanyNames);
  const [subscriptionNames, setSubscriptionNames] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState(initialRecords);
  const [dateRange, setDateRange] = useState([null, null]);
  const [sortCriteria, setSortCriteria] = useState('');

  const predefinedRanges = [
    { label: 'Today', value: [startOfDay(new Date()), endOfDay(new Date())] },
    { label: 'Yesterday', value: [startOfDay(subDays(new Date(), 1)), endOfDay(subDays(new Date(), 1))] },
    { label: 'Last 7 Days', value: [startOfDay(subDays(new Date(), 6)), endOfDay(new Date())] },
    { label: 'This Month', value: [startOfDay(new Date(new Date().getFullYear(), new Date().getMonth(), 1)), endOfDay(new Date())] },
  ];

  useEffect(() => {
    if (initialCompanyNames.length > 0) {
      const firstCompany = initialCompanyNames[0];
      setFilters(prevFilters => ({
        ...prevFilters,
        companyName: firstCompany.value,
        clientId: firstCompany.clientId
      }));
    }
  }, [initialCompanyNames]);

  useEffect(() => {
    if (filters.clientId) {
      fetchSubscriptionNames(filters.clientId);
    } else {
      setSubscriptionNames([]);
    }
  }, [filters.clientId]);

  const fetchSubscriptionNames = useCallback(async (clientId) => {
    try {
      const response = await axios.get('http://localhost:3000/api/azure', {
        params: { clientId }
      });

      const names = response.data.map(subscription => ({
        label: subscription.subscriptionName,
        value: subscription.subscriptionName
      }));

      setSubscriptionNames(names || []);

      if (names.length > 0) {
        setFilters(prevFilters => ({
          ...prevFilters,
          subscriptionName: names[0].value,
        }));
      }
    } catch (error) {
      console.error('Error fetching subscription names:', error);
    }
  }, []);

  const fetchHistoriqueRecords = useCallback(async () => {
    try {
      const response = await axios.get('/api/historique', {
        params: filters,
      });
      const { historiqueRecords } = response.data;
      setFilteredRecords(historiqueRecords || []);
    } catch (error) {
      console.error('Error fetching historique data:', error);
      setFilteredRecords([]);
    }
  }, [filters]);

  useEffect(() => {
    if (!filters.companyName || !filters.subscriptionName) {
      setFilteredRecords([]);
    } else {
      fetchHistoriqueRecords();
    }
  }, [filters, fetchHistoriqueRecords]);

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

  const handleFilterChange = (selectedOption, actionMeta) => {
    const { name } = actionMeta;
    const value = selectedOption ? selectedOption.value : '';

    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
      clientId: name === 'companyName' ? selectedOption?.clientId || '' : prevFilters.clientId
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
      const response = await axios.post('api/exportCSV', { filters });

      if (response.data && response.data.csvUrl) {
        const csvLink = document.createElement('a');
        csvLink.href = response.data.csvUrl;
        csvLink.setAttribute('download', `${filters.companyName}-${filters.subscriptionName}.csv`);
        document.body.appendChild(csvLink);
        csvLink.click();
        document.body.removeChild(csvLink);
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
          isDisabled={!filters.clientId}
          placeholder="Select Subscription"
        />

<div className="rsuite-wrapper">
  <DateRangePicker
    className={`${styles.filterSelect1}`}
    value={dateRange}
    onChange={handleDateChange}
    placeholder="Select Date Range"
    ranges={predefinedRanges}
  />
</div>


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

      

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th colSpan={5}></th>
              <th className={styles.totalCostHeader}>Total Cost: ${calculateTotalCost()}</th>
              <th></th>
            </tr>
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

export async function getServerSideProps(context) {
  try {
    const [historiqueResponse, companyResponse] = await Promise.all([
      axios.get('http://localhost:3000/api/historique'),
      axios.get('http://localhost:3000/api/clients'),
    ]);

    const { historiqueRecords } = historiqueResponse.data;
    const companyNames = companyResponse.data.map(company => ({
      label: company.companyName,
      value: company.companyName, 
      clientId: company._id
    }));

    return {
      props: {
        historiqueRecords: historiqueRecords || [],
        companyNames: companyNames || [],
        error: null,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);

    return {
      props: {
        historiqueRecords: [],
        companyNames: [],
        error: 'Failed to load data',
      },
    };
  }
}

export default HistoriquePage;
