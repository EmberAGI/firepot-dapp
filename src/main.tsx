import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import YieldVaultDetails from './features/YieldVaultDetails/components/yieldVaultDetails.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/opportunities/:id",
    element: <YieldVaultDetails />,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
