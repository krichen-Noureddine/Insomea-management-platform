import React, { useState, useEffect } from 'react';
import styles from '../styles/form.module.css'; // Import CSS module file for styling
import CloseIcon from '@mui/icons-material/Close';
const ClientForm = ({ initialData, handleSubmit,showForm, setShowForm ,resetFormMode }) => {
    const [formData, setFormData] = useState({
        companyName: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        azureTenantId: '',
        organizationType: '', // Nouveau champ ajouté
        
        domains: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    // const [showForm, setShowForm] = useState(false); // State to control form visibility

    useEffect(() => {
        if (initialData) {
            setFormData(initialData); // If there's initial data, populate the form with it
        }
    }, [initialData]); // Re-run this effect if initialData changes

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await handleSubmit(formData); // Attempt to submit form data
            setFormData({ // Reset form data upon successful submission
                companyName: '',
                contactName: '',
                contactEmail: '',
                contactPhone: '',
                clientLocation:'',
                clientAdresse:'',
              
                organizationType: '', // Nouveau champ ajouté
           
                domains: ''
            });

            setShowForm(false); 
        } catch (error) {
            console.error('Error submitting form:', error); // Log any errors
        } finally {
            setIsSubmitting(false); // Reset submission status
        }
    };

    return (
        <div className={styles.container}>
        {/* Button to toggle form display */}
        {!showForm && (
            <button onClick={() => setShowForm(true)} className={styles.submitButton}>
                {initialData ? 'Edit Client' : 'Create Client'}
            </button>
        )}

        {/* Conditionally render the form based on showForm state */}
        {showForm && (
                <div className={styles.formContainer}>
                    <form className={styles.form} onSubmit={handleFormSubmit}>
                <div className={styles.formGroup}>
                  
                    <input
                        type="text"
                        id="companyName"
                        placeholder="Client Name"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>
                <div className={styles.formGroup}>
                 
                    <input
                        type="text"
                        id="contactName"
                        placeholder='Client Contact Name'
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>
                <div className={styles.formGroup}>
              
                    <input
                        type="email"
                        placeholder="Email"
                        
                        id="contactEmail"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>
                <div className={styles.formGroup}>
               
                    <input
                        type="tel"
                        id="contactPhone"
                        placeholder="Phone"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>
                <div className={styles.formGroup}>
                
                    <input
                        type="text"
                        id="clientLocation"
                        placeholder='Location'
                        name="clientLocation"
                        value={formData.clientLocation}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>
                <div className={styles.formGroup}>
                
                    <select
                        id="organizationType"
                        name="organizationType"
                        placeholder="Organization Type"
                        value={formData.organizationType}
                        onChange={handleChange}
                        className={styles.input}
                    >
                        <option value="">Select Type</option>
                        <option value="SMB">SMB</option>
                        <option value="Enterprise">Corporate</option>
                        <option value="NGO">NGO</option>
                        <option value="Government">Government</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className={styles.formGroup}>
                    
                    <input
                        type="text"
                        id="clientAddress"
                        placeholder='Address'
                        name="clientAddress"
                        value={formData.clientAddress}
                        onChange={handleChange}
                        className={styles.input}
                    />
                </div>
             
                <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : (initialData ? 'Update' : 'Create')}
                </button>
                <button type="button" className={styles.closeButton} onClick={() => { 
                    setShowForm(false);
                    resetFormMode(); // This will reset the form to "create new" mode
                }}>
                    <CloseIcon />
                </button>
            </form>
            </div>
        )}
    </div>
);
}

export default ClientForm;
