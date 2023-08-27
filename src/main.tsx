import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
//import YieldVaultDetails from './features/YieldVaultDetails/components/yieldVaultDetails.tsx';
import ConnectWalletConfig from './features/ConnectWallet';
/*import Welcome from './pages/welcome.tsx';
import Onboarding from './features/Onboarding/onboarding.tsx';
import OnboardingStart from './features/Onboarding/stages/start/onboarding-start.tsx';
import OnboardingConfirmation from './features/Onboarding/stages/confirmation/onboarding-confirmation.tsx';
import OnboardingWelcome from './features/Onboarding/stages/welcome/onboarding-welcome.tsx';
import ChatOnboardingStart from './features/Onboarding/stages/chat/chat-onboarding-start.tsx';
import Home from './features/Home/Home.tsx';
import HomeDashboard from './features/Home/dashboard/dashboard.tsx';*/
import YieldVaultDeposit from './features/YieldVaultDeposit/yieldVaultDeposit.tsx';
import YieldVault from './features/YieldVault/yieldVault.tsx';
import Portfolio from './features/Portfolio/Portfolio.tsx';
import PortfolioDashboard from './features/Portfolio/dashboard/dashboard.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Portfolio />,
  },
  {
    path: '/portfolio',
    element: <PortfolioDashboard />,
  },
  /*{
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
    children: [
      {
        path: 'start',
        element: <OnboardingStart />,
      },
      {
        path: 'confirmation',
        element: <OnboardingConfirmation />,
      },
      {
        path: 'welcome',
        element: <OnboardingWelcome />,
      },
      {
        path: 'chat',
        element: <ChatOnboardingStart />,
      },
    ],
  },
  {
    path: 'home',
    element: <Home />,
    children: [{ path: 'dashboard', element: <HomeDashboard /> }],
  },*/
  {
    path: 'yield-vault-deposit',
    element: <YieldVaultDeposit />,
  },
  {
    path: 'yield-vault',
    element: <YieldVault />,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConnectWalletConfig>
      <RouterProvider router={router} />
    </ConnectWalletConfig>
  </React.StrictMode>,
);
