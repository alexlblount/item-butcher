import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@features/layout/MainLayout';
import ErrorView from '@features/layout/ErrorView';
import TestPage from './pages/TestPage';
import VaultPage from './pages/VaultPage';

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <ErrorView />,
    children: [
      {
        path: '/',
        element: <VaultPage />,
      },
      {
        path: 'vault',
        element: <VaultPage />,
      },
      {
        path: 'aspects',
        element: <h1>Aspects Page</h1>,
      },
    ],
  },
  {
    path: '/test',
    element: <TestPage />,
  },
]);

export default router;
