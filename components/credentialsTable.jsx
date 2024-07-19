import React from 'react';
import styles from "@/styles/form.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const CredentialsComponent = ({ credentials, clients }) => {
    return (
        <div className={styles.container}>
            <h2>Client Credentials</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Client</th>
                        <th>Tenant ID</th>
                        <th>Azure Client ID</th>
                        <th>Client Secret</th>
                        <th>Expires</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {credentials.map((credential) => {
                        const client = clients.find((client) => client._id === credential.clientId);
                        return (
                            <tr key={credential._id}>
                                <td>{client ? client.companyName : 'Unknown Client'}</td>
                                <td>{credential.tenantId}</td>
                                <td>{credential.azureClientId}</td>
                                <td>{credential.clientSecret}</td>
                                <td>{credential.expirationDate ? new Date(credential.expirationDate).toLocaleDateString() : 'No expiration date'}</td>
                                <td><FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green' }} /></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default CredentialsComponent;
