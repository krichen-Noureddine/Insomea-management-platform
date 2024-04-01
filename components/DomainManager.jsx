import React from 'react';
import styles from '../styles/form.module.css'; // Assurez-vous d'ajouter les styles nécessaires

const DomainManager = ({ domains, setDomains }) => {
    const handleDomainChange = (index, value) => {
        const updatedDomains = [...domains];
        updatedDomains[index] = value;
        setDomains(updatedDomains);
    };

    const addDomainField = () => {
        setDomains([...domains, '']);
    };

    const removeDomainField = (index) => {
        const filteredDomains = domains.filter((_, i) => i !== index);
        setDomains(filteredDomains);
    };

    return (
        <div>
            <label>Domains:</label>
            {domains.map((domain, index) => (
                <div key={index} className={styles.domainInputContainer}>
                    <input
                        type="text"
                        placeholder={`domain${index + 1}.com`}
                        value={domain}
                        onChange={(e) => handleDomainChange(index, e.target.value)}
                        className={styles.input}
                    />
                    {index > 0 && (
                        <button type="button" onClick={() => removeDomainField(index)} className={styles.removeButton}>
                            Remove
                        </button>
                    )}
                </div>
            ))}
            <button type="button" onClick={addDomainField} className={styles.addButton}>
                Add Domain
            </button>
        </div>
    );
};

export default DomainManager;
