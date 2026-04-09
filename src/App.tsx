import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { Layout } from '@/components/Layout/Layout';
import { Auth } from '@/pages/Auth/Auth';
import { TaskList } from '@/pages/TaskList/TaskList';
import { Timer } from '@/pages/Timer/Timer';
import { Settings } from '@/pages/Settings/Settings';
import { Reports } from '@/pages/Reports/Reports';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'var(--text-secondary)' }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <SettingsProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/task-list" replace />} />
          <Route path="/task-list" element={<TaskList />} />
          <Route path="/settings/:tab?" element={<Settings />} />
          <Route path="/reports/:period?/:category?" element={<Reports />} />
        </Route>
        <Route path="/timer" element={<Timer />} />
        <Route path="*" element={<Navigate to="/task-list" replace />} />
      </Routes>
    </SettingsProvider>
  );
}

export default function App() {
  return (
    <HashRouter>
      <NotificationProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </NotificationProvider>
    </HashRouter>
  );
}
