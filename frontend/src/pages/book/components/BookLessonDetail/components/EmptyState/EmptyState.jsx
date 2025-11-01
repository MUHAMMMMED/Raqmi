
import { FaFileAlt } from 'react-icons/fa';
import styles from './EmptyState.module.css';

const EmptyState = ({ message, icon = FaFileAlt, onBack }) => (
    <div className={styles.wrap}>
        <icon className={styles.icon} />
        <h3>{message}</h3>
        {onBack && <button className={styles.btn} onClick={onBack}>العودة</button>}
    </div>
);
export default EmptyState;