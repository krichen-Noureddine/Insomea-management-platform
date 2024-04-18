import React, { useState, useEffect } from 'react';
import styles from '../styles/form.module.css';
import Provider from '../model/Provider';
import { DeleteConfirmationPopup } from './DeleteConfirmationPopup';
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
export default function ProviderForm() {
    const [name, setName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [providers, setProviders] = useState([]);
    const [message, setMessage] = useState('');
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [deleteProviderId, setDeleteProviderId] = useState(null);
    useEffect(() => {
        fetchProviders();
    }, []);

    const fetchProviders = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/azure/provider');
            if (response.ok) {
                const data = await response.json();
                setProviders(data);
            } else {
                console.error('Failed to fetch providers');
            }
        } catch (error) {
            console.error('Failed to fetch providers:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const provider = new Provider({
            name,
            contactEmail,
            contactPhone,
            azureSubscriptions: []
        });

        const response = await fetch('http://localhost:3000/api/azure/provider', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(provider)
        });

        if (response.ok) {
            setName('');
            setContactEmail('');
            setContactPhone('');
            setMessage('Provider added successfully!');
            fetchProviders();
        } else {
            setMessage('Failed to add provider. Please try again.');
        }
    };

    const handleDelete = async (providerId, providerName) => {
        try {
            setDeleteProviderId(providerId);
            setIsDeletePopupOpen(true);
        } catch (error) {
            console.error('Failed to delete provider:', error);
            setMessage('Failed to delete provider. Please try again.');
        }
    };

    const confirmDelete = async () => {
        try {
            // Send delete request to the backend API
            const response = await fetch(`http://localhost:3000/api/azure/provider/${deleteProviderId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Refresh providers list after successful deletion
                fetchProviders();
                setMessage('Provider deleted successfully!');
            } else {
                // Display error message if deletion fails
                setMessage('Failed to delete provider. Please try again.');
            }
        } catch (error) {
            console.error('Failed to delete provider:', error);
            setMessage('Failed to delete provider. Please try again.');
        } finally {
            // Close the delete confirmation popup
            setIsDeletePopupOpen(false);
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="contactEmail">Contact Email:</label>
                    <input type="email" id="contactEmail" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="contactPhone">Contact Phone:</label>
                    <PhoneInput
                        id="contactPhone"
                        value={contactPhone}
                        onChange={setContactPhone}
                        className={styles.input}
                        defaultCountry="TN"
                        international
                        required
                    />
                              </div>
                <button type="submit" className={styles.submitButton}>Add Provider</button>
                {message && <p>{message}</p>}
            </form>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Contact Email</th>
                        <th>Contact Phone</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {providers.map(provider => (
                        <tr key={provider._id}>
                            <td>{provider.name}</td>
                            <td>{provider.contactEmail}</td>
                            <td>{provider.contactPhone}</td>
                            <td>
                            <button onClick={() => handleDelete(provider._id, provider.name)}>Delete</button> 
                                
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <DeleteConfirmationPopup
                isOpen={isDeletePopupOpen}
                onClose={() => setIsDeletePopupOpen(false)}
                onConfirm={confirmDelete}
            />
        </div>
    );
}
