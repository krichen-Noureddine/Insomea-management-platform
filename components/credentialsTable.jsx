import React from 'react';
import styles from "@/styles/form.module.css";

const CredentialsComponent = ({ credentials, clients }) => {
    return (
        <div className={styles.container}>
            <h2>Client Credentials</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Client</th>
                        <th>Tenant ID</th>
                        <th>Client Secret</th>
                        <th>Azure App ID</th>
                       
                    </tr>
                </thead>
                <tbody>
                    {credentials.map((credential) => {
                        const client = clients.find((client) => client._id === credential.clientId);
                        return (
                            <tr key={credential._id}>
                                <td>{client ? client.companyName : 'Unknown Client'}</td>
                                <td>{credential.tenantId}</td>
                                <td>{credential.clientSecret}</td>
                                <td>{credential.azureAppId}</td>
                               
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default CredentialsComponent;
