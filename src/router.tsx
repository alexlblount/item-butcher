import { createBrowserRouter } from 'react-router-dom';
import AspectPage from '@features/aspects/AspectPage';
import ErrorView from '@features/layout/ErrorView';
import MainLayout from '@features/layout/MainLayout';
import TestPage from '@features/imageCapture/TestPage';
import VaultPage from '@features/vault/VaultPage';

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
        element: <AspectPage />,
      },
    ],
  },
  {
    path: '/test',
    element: <TestPage />,
  },
]);

export default router;
