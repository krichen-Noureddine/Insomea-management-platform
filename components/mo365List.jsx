import React from 'react';
import Link from 'next/link';
import styles from '../styles/Mo365List.module.css';
import { FaInfoCircle } from 'react-icons/fa';

const Mo365List = ({ subscriptions }) => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Subscription List</h1>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Client ID</th>
                        <th>Client Name</th>
                        <th>Account Name</th>
                        <th>Status</th>
                        <th>SKU</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {subscriptions.map((subscription) => (
                        <tr key={subscription.id}>
                            <td>{subscription.clientId}</td>
                            <td>{subscription.clientName}</td>
                            <td>{subscription.accountName}</td>
                            <td>
                                <span className={`${styles.status} ${subscription.status === 'Enabled' ? styles.enabled : styles.disabled}`}>
                                    {subscription.status}
                                </span>
                            </td>
                            <td>{subscription.skuPartNumber}</td>
                            <td>{new Date(subscription.createdDateTime).toLocaleDateString()}</td>
                            <td>{subscription.nextLifecycleDateTime ? new Date(subscription.nextLifecycleDateTime).toLocaleDateString() : 'N/A'}</td>
                            <td>
                                <Link href={`/mo365/Subscriptions/${subscription._id}`} legacyBehavior>
                                    <a className={styles.detailsButton}><FaInfoCircle /> View Details</a>
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
