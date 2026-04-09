import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { NotificationContainer } from '@/components/Notification/Notification';
import styles from './Auth.module.css';

type AuthMode = 'login' | 'register' | 'reset';

export function Auth() {
  const { login, register, resetPassword } = useAuth();
  const { notify } = useNotification();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    if (mode !== 'reset' && !password.trim()) return;

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
        notify('success', 'Logged in successfully');
      } else if (mode === 'register') {
        await register(email, password);
        notify('success', `User ${email} registered successfully`);
      } else {
        await resetPassword(email);
        notify('success', 'Password reset email sent. Check your inbox.');
        setMode('login');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Operation failed';
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

        {mode !== 'reset' ? (
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${mode === 'login' ? styles.activeTab : ''}`}
              onClick={() => setMode('login')}
            >
              Login
            </button>
            <button
              className={`${styles.tab} ${mode === 'register' ? styles.activeTab : ''}`}
              onClick={() => setMode('register')}
            >
              Register
            </button>
          </div>
        ) : (
          <p className={styles.resetHint}>
            Enter your email and we'll send a link to reset your password.
          </p>
        )}

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

          {mode !== 'reset' && (
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
          )}

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading
              ? 'Please wait...'
              : mode === 'login'
                ? 'Login'
                : mode === 'register'
                  ? 'Create Account'
                  : 'Send Reset Link'}
          </button>
        </form>

        <div className={styles.footer}>
          {mode === 'reset' ? (
            <button className={styles.linkBtn} onClick={() => setMode('login')}>
              Back to Login
            </button>
          ) : (
            <button className={styles.linkBtn} onClick={() => setMode('reset')}>
              Forgot password?
            </button>
          )}
        </div>
      </div>
      <NotificationContainer />
    </div>
  );
}
