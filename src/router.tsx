import { createBrowserRouter } from 'react-router-dom';
import AspectPage from '@features/aspects/AspectPage';
import ErrorView from '@features/layout/ErrorView';
import LandingPage from '@features/layout/LandingPage';
import MainLayout from '@features/layout/MainLayout';
import TestPage from '@features/imageCapture/TestPage';
import VaultPage from '@features/vault/VaultPage';

// const basename = process.env.NODE_ENV === 'production' ? '/item-butcher/' : '/';
const basename = '/item-butcher/';

const router = createBrowserRouter(
  [
    {
      // path: '/',
      element: <MainLayout />,
      errorElement: <ErrorView />,
      children: [
        {
          path: '/',
          element: <LandingPage />,
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
  ],
  { basename },
);

export default router;
