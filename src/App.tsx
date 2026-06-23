import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import LoginPage from './components/auth/LoginPage';
import AppShell from './components/layout/AppShell';
import AccountsListPage from './components/accounts/AccountsListPage';
import AccountDetailPage from './components/accounts/AccountDetailPage';

export default function App() {
  const currentEmail = useAppStore((s) => s.currentEmail);

  if (!currentEmail) return <LoginPage />;

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<AccountsListPage />} />
        <Route path="/accounts/:id" element={<AccountDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
