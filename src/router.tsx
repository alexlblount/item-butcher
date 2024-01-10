import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import ErrorPage from './pages/ErrorPage';
import TestPage from './pages/TestPage';
import ItemsPage from './pages/ItemsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/items',
    element: <ItemsPage />,
  },
  {
    path: '/test',
    element: <TestPage />,
  },
]);

export default router;
