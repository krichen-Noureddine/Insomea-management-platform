import React, { useState } from 'react';
import styles from '../styles/AzureList.module.css'; // Import your CSS module
import LoadingSpinner from './LoadingSpinner';

const AzureSubscriptionsTable = ({ clients, subscriptions, fetchSubscriptions }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredClients, setFilteredClients] = useState(clients); // State to hold filtered clients

    const handleSearchChange = (event) => {
        const searchTerm = event.target.value;
        setSearchTerm(searchTerm);

        // Filter clients based on companyName containing search term
        const filteredClients = clients.filter(client =>
            client.companyName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredClients(filteredClients);
    };

    return (
        <div className={styles.container}>
            {/* Search and Filter Bar */}
            <div className={styles.searchAndFilterBar}>
                {/* Search Input */}
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search by Company Name..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                
                {/* Filter Select */}
                <select className={styles.filterSelect1}>
                    <option value="">Filter by...</option>
                    <option value="name">Name</option>
                    <option value="date">Date</option>
                    <option value="type">Type</option>
                </select>
                
                {/* PDF Export Button */}
                <button className={styles.pdfExportButton}>Export to PDF</button>
            </div>

            {/* Clients and Subscriptions Table */}
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Tenant Id</th>
                            <th>Company Name</th>
                            <th>Subscription Name</th>
                            <th>Azure Offer</th>
                            <th>Status</th>
                            <th>Subscription Id</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="6"><LoadingSpinner /></td>
                            </tr>
                        ) : (
                            filteredClients.flatMap(client => 
                                subscriptions
                                    .filter(subscription => subscription.clientId === client.clientId)
                                    .map(subscription => (
                                        <tr key={subscription.subscriptionId}>
                                            <td>{client.tenantId}</td>
                                            <td>{client.companyName}</td>
                                            <td>{subscription.subscriptionName}</td>
                                            <td>{subscription.azureOffer}</td>
                                            <td>{subscription.status}</td>
                                            <td>{subscription.subscriptionId}</td>
                                        </tr>
                                    ))
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AzureSubscriptionsTable;
