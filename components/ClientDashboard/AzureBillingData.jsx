import React from 'react';
import styles from '../../styles/Clientdashboard.module.css';

const AzureBillingDateWidget = () => {
    const nextBillingDate = "2024-05-30"; // Static next billing date

    return (
        <div className={styles.AzureBillingDateWidgetcontainer}>
            <h2>Next Azure Billing Date</h2>
            <p>{nextBillingDate}</p>
        </div>
    );
};

export default AzureBillingDateWidget;
