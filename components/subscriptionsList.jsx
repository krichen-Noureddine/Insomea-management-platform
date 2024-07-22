import React, { useState } from 'react';
import styles from '../styles/AzureList.module.css';

const AzureSubscriptionsTable = ({ subscriptions }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredSubscriptions = subscriptions.filter(subscription =>
        subscription.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <div className={styles.searchAndFilterBar}>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search by Company Name..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <select className={styles.filterSelect}>
                    <option value="">Filter by...</option>
                    <option value="name">Name</option>
                    <option value="date">Date</option>
                    <option value="type">Type</option>
                </select>
                <button className={styles.pdfExportButton}>Export to PDF</button>
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
                    </tr>
                </thead>
                <tbody>
                    {filteredSubscriptions.map(subscription => (
                        <tr key={subscription.subscriptionId}>
                            <td>{subscription.companyName}</td>
                            <td>{subscription.tenantId}</td>
                            <td>{subscription.subscriptionName}</td>
                            <td>{subscription.subscriptionId}</td>
                            <td>{subscription.status}</td>
                            <td>{subscription.azureOffer}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AzureSubscriptionsTable;
