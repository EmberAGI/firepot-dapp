import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import YieldVaultDetails from './features/YieldVaultDetails/components/yieldVaultDetails.tsx';
import ConnectWalletConfig from './features/ConnectWallet';
import Header from './components/Header';
import Dashboard from './dashboard.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Header />
        <Dashboard />
      </>
    ),
  },
  {
    path: '/opportunities/:id',
    element: (
      <YieldVaultDetails />
    ),
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConnectWalletConfig>
      <RouterProvider router={router} />
    </ConnectWalletConfig>
  </React.StrictMode>,
);
