import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import YieldVaultDetails from './features/YieldVaultDetails/components/yieldVaultDetails.tsx';
import ConnectWalletConfig from './features/ConnectWallet';
import Header from './components/Header/index.tsx';
import Dashboard from './pages/dashboard.tsx';
import Welcome from './pages/welcome.tsx';
import Onboarding from './features/Onboarding/onboarding.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <main className='dashboard'>
        <Header />
        <Dashboard />
      </main>
    ),
  },
  {
    path: '/opportunities/:id',
    element: <YieldVaultDetails />,
  },
  {
    path: 'core',
    element: <Welcome />,
  },
  {
    path: 'onboarding',
    element: <Onboarding />,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConnectWalletConfig>
      <RouterProvider router={router} />
    </ConnectWalletConfig>
  </React.StrictMode>,
);
