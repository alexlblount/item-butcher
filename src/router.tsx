import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import ErrorPage from './pages/ErrorPage';
import TestPage from './pages/TestPage';

export default createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/helloworld',
    element: <div>Hello world!</div>,
  },
  {
    path: '/test',
    element: <TestPage />,
  }
]);
