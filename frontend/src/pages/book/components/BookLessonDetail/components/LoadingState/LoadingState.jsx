
import styles from './LoadingState.module.css';
const LoadingState = () => (
    <div className={styles.wrap}>
        <div className={styles.spin}></div>
        <p>جاري تحميل الدرس...</p>
    </div>
);
export default LoadingState;