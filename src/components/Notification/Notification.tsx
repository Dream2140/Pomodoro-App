import { useNotification } from '@/context/NotificationContext';
import styles from './Notification.module.css';

export function NotificationContainer() {
  const { notifications, dismiss } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className={styles.container} role="status" aria-live="polite">
      {notifications.map((n) => (
        <div key={n.id} className={`${styles.notification} ${styles[n.type]}`} role="alert">
          <div className={styles.iconWrap}>
            <span className={styles.icon}>{getIcon(n.type)}</span>
          </div>
          <div className={styles.content}>
            <p className={styles.text}>{n.text}</p>
          </div>
          <button
            className={styles.closeBtn}
            onClick={() => dismiss(n.id)}
            aria-label="Dismiss notification"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}

function getIcon(type: string) {
  switch (type) {
    case 'success':
      return '\u2713';
    case 'error':
      return '\u2717';
    case 'warning':
      return '\u26A0';
    default:
      return '\u2139';
  }
}
