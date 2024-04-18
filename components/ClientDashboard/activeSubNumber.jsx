
import styles from '../../styles/ClientDashboard/active-subscriptions.module.css';

const ActiveSubscriptions = () => {
  // Static number of active subscriptions
  const staticCount = 3;

  return (
    <div className={styles.activeSubscriptions}>
      <span className={styles.number}>{staticCount}</span>
      <span className={styles.label}>Active Azure Subscriptions</span>
    </div>
  );
};

export default ActiveSubscriptions;
