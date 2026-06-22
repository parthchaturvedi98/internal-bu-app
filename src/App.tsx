import { Routes, Route, Navigate } from 'react-router-dom';
import { useIsAuthenticated } from '@azure/msal-react';
import LoginPage from './components/auth/LoginPage';
import AppShell from './components/layout/AppShell';
import AccountsListPage from './components/accounts/AccountsListPage';
import AccountDetailPage from './components/accounts/AccountDetailPage';

export default function App() {
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) return <LoginPage />;

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<AccountsListPage />} />
        <Route path="/all" element={<AccountsListPage showAll />} />
        <Route path="/accounts/:id" element={<AccountDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
