import styles from './Notification.module.css';

interface NotificationProps {
  text: string;
}

export default function Notification({ text }: NotificationProps) {
  return (
    <div className={styles.notification}>
      <div id="spinner" className={styles.loader} />
      <div className={styles.text}>{text}</div>
    </div>
  );
}
