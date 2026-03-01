import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { BlinkProvider, BlinkAuthProvider } from '@blinkdotnew/react';
import App from './App';
import './index.css';
import './lib/i18n';

const queryClient = new QueryClient();

function getProjectId(): string {
  const envId = import.meta.env.VITE_BLINK_PROJECT_ID;
  if (envId) return envId;
  const hostname = window.location.hostname;
  const match = hostname.match(/^([^.]+)\.sites\.blink\.new$/);
  return match ? match[1] : 'demo-project';
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BlinkProvider 
        projectId={getProjectId()} 
        publishableKey={import.meta.env.VITE_BLINK_PUBLISHABLE_KEY || ''}
      >
        <BlinkAuthProvider>
          <Toaster position="top-right" />
          <App />
        </BlinkAuthProvider>
      </BlinkProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);