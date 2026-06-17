import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' sprawia, że zasoby ładują się poprawnie niezależnie od ścieżki
// wdrożenia (np. https://user.github.io/repo/) — działa na GH Pages, Netlify i Vercel.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  optimizeDeps: {
    include: ['@mui/material', '@emotion/react', '@emotion/styled'],
  },
});
