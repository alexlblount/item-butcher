import React from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import 'modern-normalize';
// aliased
import { clearSessionStorage } from '@features/imageParsing/thumbnailer.ts';
// relative
import { store } from './state/store.ts';
import router from './router';
import './i18n.ts';
import './index.css';

// Clear session storage in production or non-HMR contexts
if (import.meta.hot) {
  clearSessionStorage();
  console.log('HMR - initial session storage clear');

  import.meta.hot.accept(() => {
    // This function runs when the module or one of its dependencies is hot-replaced.
    console.log('Module updated without clearing session storage');
  });
} else {
  clearSessionStorage();
  console.log('SESSION STORAGE CLEARED');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);
