import { Outlet } from 'react-router-dom';
import { Header } from '@/components/Header/Header';
import { NotificationContainer } from '@/components/Notification/Notification';
import styles from './Layout.module.css';

interface LayoutProps {
  onAddTask?: () => void;
}

export function Layout({ onAddTask }: LayoutProps) {
  return (
    <div className={styles.layout}>
      <Header onAddTask={onAddTask} />
      <main className={styles.content}>
        <Outlet />
      </main>
      <NotificationContainer />
    </div>
  );
}
