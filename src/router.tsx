import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import ErrorPage from './pages/ErrorPage';
import TestPage from './pages/TestPage';
import VaultPage from './pages/VaultPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/vault',
    element: <VaultPage />,
  },
  {
    path: '/test',
    element: <TestPage />,
  },
]);

export default router;
