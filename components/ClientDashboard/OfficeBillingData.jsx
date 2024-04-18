import React from 'react';
import styles from '../../styles/Clientdashboard.module.css';

const OfficeBillingDateWidget = () => {
    const nextBillingDate = "2024-08-10"; // Static next billing date

    return (
        <div className={styles.AzureBillingDateWidgetcontainer}>
            <h2>Next Office Billing Date</h2>
            <p>{nextBillingDate}</p>
        </div>
    );
};

export default OfficeBillingDateWidget;
