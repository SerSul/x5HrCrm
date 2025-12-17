import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import { router } from './routes.tsx';
import { ThemeProvider } from '@gravity-ui/uikit';
import { useAuthStore } from './storage/authStorage';

import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';

import './index.css';

async function enableMocking() {
  if (!import.meta.env.DEV || import.meta.env.VITE_USE_REAL_API === 'true') {
    return;
  }

  const { server } = await import('../../../mocks/worker.ts');
  return server.start();
}

async function initialize() {
  await enableMocking();
  await useAuthStore.getState().restoreSession();

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ThemeProvider theme="light">
        <RouterProvider router={router} />
      </ThemeProvider>
    </StrictMode>
  );
}

initialize();
