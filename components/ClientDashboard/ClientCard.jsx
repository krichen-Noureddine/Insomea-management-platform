import styles from '../../styles/Clientdashboard.module.css'; // Ajustez le chemin d'accès selon le besoin

const ClientCard = ({ client, onEditClick, onDetailsClick }) => {
  return (
    <div className={styles.card}>
         <div className={`${styles.statusIndicator} ${styles.active}`}>
        Active {/* Texte forcé à 'Active' pour le test */}
    </div>
      <table className={styles.clientTable}>
        <tbody>
          <tr><th>Company Name</th><td>{client.companyName}</td></tr>
          <tr><th>Contact Name</th><td>{client.contactName}</td></tr>
          <tr><th>Email</th><td>{client.contactEmail}</td></tr>
          <tr><th>Phone</th><td>{client.contactPhone}</td></tr>
          <tr><th>Location</th><td>{client.clientLocation}</td></tr>
          <tr><th>Address</th><td>{client.clientAddress}</td></tr>
          <tr><th>Azure Tenant ID</th><td>{client.azureTenantId}</td></tr>
          <tr><th>Organization Type</th><td>{client.organizationType}</td></tr>
          <tr><th>Status</th><td>{client.status}</td></tr>
          {/* <tr><th>Domains</th><td>{client.domains?.join(', ')}</td></tr> */}
        </tbody>
      </table>
      <div className={styles.actions}>
        <button onClick={() => onEditClick(client)}>Edit</button>
        <button onClick={() => onDetailsClick(client)}>View Details</button>
      </div>
    </div>
  );
};

export default ClientCard;
