import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { isConfigured } from './lib/firebaseClient';
import './index.css';
import App from './App';

const root = document.getElementById('root')!;

if (!isConfigured) {
  root.innerHTML = `
    <div style="font-family:sans-serif;max-width:520px;margin:80px auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;background:#fff">
      <h1 style="font-size:20px;font-weight:600;margin:0 0 8px">BU Tracker — Setup Required</h1>
      <p style="color:#6b7280;font-size:14px;margin:0 0 16px">The app needs a Firebase project before it can run.</p>
      <ol style="color:#374151;font-size:14px;line-height:1.8;padding-left:20px">
        <li>Create a free Firebase project at <strong>console.firebase.google.com</strong></li>
        <li>Enable <strong>Firestore Database</strong> in test mode</li>
        <li>Go to Project Settings → Your apps → Web → copy the config</li>
        <li>Paste the config into <code style="background:#f3f4f6;padding:2px 6px;border-radius:4px">src/lib/firebaseClient.ts</code></li>
        <li>Push to main — GitHub Actions redeploys automatically</li>
      </ol>
    </div>`;
} else {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 2 * 60 * 1000, retry: 1 } },
  });

  createRoot(root).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <App />
        </HashRouter>
      </QueryClientProvider>
    </StrictMode>
  );
}
