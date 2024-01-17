import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  // deploying to github pages
  base: '/item-butcher/',
  plugins: [tsconfigPaths(), react()],
});
