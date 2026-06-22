import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MsalProvider } from '@azure/msal-react';
import { msalInstance, isConfigured } from './lib/auth';
import './index.css';
import App from './App';

const root = document.getElementById('root')!;

if (!isConfigured || !msalInstance) {
  root.innerHTML = `
    <div style="font-family:sans-serif;max-width:520px;margin:80px auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;background:#fff">
      <h1 style="font-size:20px;font-weight:600;margin:0 0 8px">BU Tracker — Setup Required</h1>
      <p style="color:#6b7280;font-size:14px;margin:0 0 16px">The app needs Azure AD credentials before it can run.</p>
      <ol style="color:#374151;font-size:14px;line-height:1.8;padding-left:20px">
        <li>Register the app in <strong>Azure Active Directory</strong> and copy the <em>Client ID</em> and <em>Tenant ID</em></li>
        <li>Edit <code style="background:#f3f4f6;padding:2px 6px;border-radius:4px">src/lib/auth.ts</code> — replace the two placeholder values</li>
        <li>Edit <code style="background:#f3f4f6;padding:2px 6px;border-radius:4px">src/lib/sharepointConfig.ts</code> — set your SharePoint site URL</li>
        <li>Push to main — GitHub Actions will redeploy automatically</li>
      </ol>
    </div>`;
} else {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 2 * 60 * 1000, retry: 1 } },
  });

  createRoot(root).render(
    <StrictMode>
      <MsalProvider instance={msalInstance}>
        <QueryClientProvider client={queryClient}>
          <HashRouter>
            <App />
          </HashRouter>
        </QueryClientProvider>
      </MsalProvider>
    </StrictMode>
  );
}
