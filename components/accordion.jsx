import React, { useState } from 'react';
import styles from '@/styles/accordion.module.css'; // Ensure you have a CSS module for the accordion styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';

const Accordion = ({ subscription, onRefresh }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={styles.accordionItem}>
            <div className={styles.accordionHeader} onClick={toggleAccordion}>
                <h3>{subscription.subscriptionName}</h3>
                <div className={styles.icon}>
                    {isOpen ? (
                        <FontAwesomeIcon icon={faMinusCircle} />
                    ) : (
                        <FontAwesomeIcon icon={faPlusCircle} />
                    )}
                </div>
            </div>
            {isOpen && (
                <div className={styles.accordionContent}>
                                        <p><strong>Service Type:</strong> {subscription.serviceType}</p>

                    <p><strong>azureOffer:</strong> {subscription.azureOffer}</p>
                    <p><strong>Subscription Start Date:</strong> {new Date(subscription.subscriptionStartDate).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> {subscription.status}</p>
                    
                    {/* Add more subscription details as needed */}
                </div>
            )}
        </div>
    );
};

export default Accordion;
