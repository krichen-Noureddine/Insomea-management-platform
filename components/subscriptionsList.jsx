import React, { useState } from 'react';
import axios from 'axios';
import { FaSyncAlt, FaFileExcel } from 'react-icons/fa';
import styles from '../styles/AzureList.module.css';

const AzureSubscriptionsTable = ({ subscriptions, handleRefresh }) => {
  const [filters, setFilters] = useState({
    companyName: '',
    subscriptionName: '',
    status: 'All', // Default to "All" for no status filter
    dateOrder: 'Newest', // Default to sorting by newest
  });

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleExportExcel = async () => {
    try {
      const response = await axios.post('api/exportExcelSub');

      if (response.data && response.data.excelUrl) {
        const excelLink = document.createElement('a');
        excelLink.href = response.data.excelUrl;
        excelLink.setAttribute('download', 'subscriptions.xlsx');
        document.body.appendChild(excelLink);
        excelLink.click();
        document.body.removeChild(excelLink);
      } else {
        console.error('Error exporting Excel: Invalid response from server');
      }
    } catch (error) {
      console.error('Error exporting Excel:', error);
    }
  };

  // Filter and sort subscriptions based on selected criteria
  const filteredSubscriptions = subscriptions
    .filter((subscription) => 
      subscription.companyName.toLowerCase().includes(filters.companyName.toLowerCase()) &&
      subscription.subscriptionName.toLowerCase().includes(filters.subscriptionName.toLowerCase()) &&
      (filters.status === 'All' || subscription.status === filters.status)
    )
    .sort((a, b) => {
      if (filters.dateOrder === 'Newest') {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      } else {
        return new Date(a.updatedAt) - new Date(b.updatedAt);
      }
    });

  return (
    <div className={styles.container}>
      <div className={styles.searchAndFilterBar}>
        <input
          type="text"
          placeholder="Search by Company Name"
          name="companyName"
          value={filters.companyName}
          onChange={handleFilterChange}
          className={styles.searchInput}
        />


        {/* Status Filter Dropdown */}
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className={styles.filterSelect}
        >
          <option value="All">All Statuses</option>
          <option value="Enabled">Enabled</option>
          <option value="Disabled">Disabled</option>
          <option value="PastDue">Past Due</option>
          <option value="Warned">Warned</option>
          <option value="Expired">Expired</option>
        </select>

        {/* Date Order Filter Dropdown */}
        <select
          name="dateOrder"
          value={filters.dateOrder}
          onChange={handleFilterChange}
          className={styles.filterSelect}
        >
          <option value="Newest">Newest</option>
          <option value="Oldest">Oldest</option>
        </select>

        <button onClick={handleRefresh} className={styles.pdfExportButton}>
          <FaSyncAlt /> Refresh Subscriptions
        </button>

        <button onClick={handleExportExcel} className={styles.pdfExportButton}>
          <FaFileExcel /> Export to Excel
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Tenant Id</th>
            <th>Subscription Name</th>
            <th>Subscription Id</th>
            <th>Status</th>
            <th>Azure Offer</th>
            <th>Last Update DateTime</th>
          </tr>
        </thead>
        <tbody>
          {filteredSubscriptions.map((subscription) => (
            <tr key={subscription.subscriptionId}>
              <td>{subscription.companyName}</td>
              <td>{subscription.tenantId}</td>
              <td>{subscription.subscriptionName}</td>
              <td>{subscription.subscriptionId}</td>
              <td>{subscription.status}</td>
              <td>{subscription.azureOffer}</td>
              <td>
                {new Date(subscription.updatedAt).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AzureSubscriptionsTable;
