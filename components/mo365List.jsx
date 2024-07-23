import React, { useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Mo365List.module.css';
import { Info } from '@mui/icons-material';

const Mo365List = ({ subscriptions }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredSubscriptions, setFilteredSubscriptions] = useState(subscriptions);

    const handleSearchChange = (event) => {
        const searchTerm = event.target.value;
        setSearchTerm(searchTerm);

        const filteredSubs = subscriptions.filter(subscription =>
            subscription.clientName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredSubscriptions(filteredSubs);
    };

    return (
        <div className={styles.container}>
                        <h1 className={styles.title}>Mo 365 Licenses List</h1>

            <div className={`${styles.searchAndFilterBar}`}>
                <input
                    type="text"
                    className={`${styles.searchInput} ${styles.formControl}`}
                    placeholder="Search by Client Name..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                
                {/* Filter Select */}
                <select className={`${styles.filterSelect} ${styles.formControl}`}>
                    <option value="">Filter by...</option>
                    <option value="status">Status</option>
                    <option value="sku">SKU</option>
                    <option value="date">Date</option>
                </select>
            </div>

            {/* Mo365 Licenses List */}
            <table className={styles.table}>
                <thead>
                    <tr>
                     
                        <th>Client Name</th>
                        <th>Status</th>
                        <th>SKU</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSubscriptions.map((subscription) => (
                        <tr key={subscription.id}>
                           
                            <td>{subscription.clientName}</td>
                            <td>
                                <span className={`${styles.status} ${subscription.status === 'Enabled' ? styles.enabled : styles.disabled}`}>
                                    {subscription.status}
                                </span>
                            </td>
                            <td>{subscription.skuPartNumber}</td>
                            <td>{new Date(subscription.createdDateTime).toLocaleDateString()}</td>
                            <td>{subscription.nextLifecycleDateTime ? new Date(subscription.nextLifecycleDateTime).toLocaleDateString() : 'N/A'}</td>
                            <td>
                                <Link href={`/mo365/${subscription._id}`} passHref>
                                    <div className={styles.detailsButton}><Info/> View Details</div>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Mo365List;
