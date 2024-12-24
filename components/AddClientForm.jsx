import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from '../styles/form.module.css';
import CloseIcon from '@mui/icons-material/Close';

const ClientForm = ({ initialData, handleSubmit, showForm, setShowForm, resetFormMode }) => {
    const { register, handleSubmit: handleFormSubmit, formState: { errors }, reset } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Populate form fields with initial data if provided
    useEffect(() => {
        if (initialData) {
            reset(initialData); // Use reset from react-hook-form to set initial data
        } else {
            reset({ // Reset to default values if no initial data
                companyName: '',
                contactName: '',
                contactEmail: '',
                contactPhone: '',
                clientLocation: '',
                clientAddress: '',
                organizationType: '',
                domains: ''
            });
        }
    }, [initialData, reset]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            await handleSubmit(data);
            reset(); // Reset form on successful submission
            setShowForm(false);
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            {!showForm && (
                <button onClick={() => setShowForm(true)} className={styles.submitButton}>
                    {initialData ? 'Edit Client' : 'Create Client'}
                </button>
            )}

            {showForm && (
                <div className={styles.formContainer}>
                    <form className={styles.form} onSubmit={handleFormSubmit(onSubmit)}>
                        <div className={styles.formGroup}>
                            <input
                                type="text"
                                id="companyName"
                                placeholder="Client Name"
                                {...register('companyName', { required: 'Company name is required' })}
                                className={styles.input}
                            />
                            {errors.companyName && <p className={styles.error}>{errors.companyName.message}</p>}
                        </div>
                        <div className={styles.formGroup}>
                            <input
                                type="text"
                                id="contactName"
                                placeholder='Client Contact Name'
                                {...register('contactName', { required: 'Contact name is required' })}
                                className={styles.input}
                            />
                            {errors.contactName && <p className={styles.error}>{errors.contactName.message}</p>}
                        </div>
                        <div className={styles.formGroup}>
                            <input
                                type="email"
                                id="contactEmail"
                                placeholder="Email"
                                {...register('contactEmail', { required: 'Email is required' })}
                                className={styles.input}
                            />
                            {errors.contactEmail && <p className={styles.error}>{errors.contactEmail.message}</p>}
                        </div>
                        <div className={styles.formGroup}>
                            <input
                                type="tel"
                                id="contactPhone"
                                placeholder="Phone"
                                {...register('contactPhone', { required: 'Phone number is required' })}
                                className={styles.input}
                            />
                            {errors.contactPhone && <p className={styles.error}>{errors.contactPhone.message}</p>}
                        </div>
                        <div className={styles.formGroup}>
                            <input
                                type="text"
                                id="clientLocation"
                                placeholder='Location'
                                {...register('clientLocation')}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <select
                                id="organizationType"
                                {...register('organizationType', { required: 'Organization type is required' })}
                                className={styles.input}
                            >
                                <option value="">Select Type</option>
                                <option value="SMB">SMB</option>
                                <option value="Enterprise">Corporate</option>
                                <option value="NGO">NGO</option>
                                <option value="Government">Government</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.organizationType && <p className={styles.error}>{errors.organizationType.message}</p>}
                        </div>
                        {/* <div className={styles.formGroup}>
                            <input
                                type="text"
                                id="clientAddress"
                                placeholder='Address'
                                {...register('clientAddress')}
                                className={styles.input}
                            />
                        </div> */}

                        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : (initialData ? 'Update' : 'Create')}
                        </button>
                        <button type="button" className={styles.closeButton} onClick={() => { 
                            setShowForm(false);
                            resetFormMode();
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
