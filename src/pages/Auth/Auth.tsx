import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { NotificationContainer } from '@/components/Notification/Notification';
import styles from './Auth.module.css';

export function Auth() {
  const { login, register } = useAuth();
  const { notify } = useNotification();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        notify('success', 'Logged in successfully');
      } else {
        await register(email, password);
        notify('success', `User ${email} registered successfully`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      notify('error', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Pomodoro App</h1>
        <p className={styles.subtitle}>Productivity Timer &amp; Task Manager</p>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${isLogin ? styles.activeTab : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`${styles.tab} ${!isLogin ? styles.activeTab : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="auth-email" className={styles.label}>
              Email
            </label>
            <input
              id="auth-email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              autoFocus
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="auth-password" className={styles.label}>
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              minLength={6}
            />
          </div>
          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>
      </div>
      <NotificationContainer />
    </div>
  );
}
