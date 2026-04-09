import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import styles from './Header.module.css';

interface HeaderProps {
  onAddTask?: () => void;
}

export function Header({ onAddTask }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const getPageTitle = () => {
    if (location.pathname.startsWith('/timer')) return 'Timer';
    if (location.pathname.startsWith('/settings')) return 'Settings';
    if (location.pathname.startsWith('/reports')) return 'Reports';
    return 'Task List';
  };

  const isTaskList = location.pathname === '/task-list' || location.pathname === '/';

  return (
    <header className={styles.header} role="banner">
      <div className={styles.container}>
        <div className={styles.titleWrap}>
          <h1 className={styles.title}>{getPageTitle()}</h1>
          {isTaskList && onAddTask && (
            <button
              className={styles.addBtn}
              onClick={onAddTask}
              aria-label="Add new task"
            >
              +
            </button>
          )}
        </div>
        <nav className={styles.nav} aria-label="Main navigation">
          <ul className={styles.navList}>
            <li>
              <button
                className={`${styles.navBtn} ${location.pathname.startsWith('/task-list') || location.pathname === '/' ? styles.active : ''}`}
                onClick={() => navigate('/task-list')}
              >
                Tasks
              </button>
            </li>
            <li>
              <button
                className={`${styles.navBtn} ${location.pathname.startsWith('/reports') ? styles.active : ''}`}
                onClick={() => navigate('/reports/day/pomodoros')}
              >
                Reports
              </button>
            </li>
            <li>
              <button
                className={`${styles.navBtn} ${location.pathname.startsWith('/settings') ? styles.active : ''}`}
                onClick={() => navigate('/settings/pomodoros')}
              >
                Settings
              </button>
            </li>
            <li>
              <button className={styles.navBtn} onClick={logout} aria-label="Log out">
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
