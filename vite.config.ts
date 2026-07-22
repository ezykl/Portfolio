import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      exclude: [
        /_framer-runtime\.js$/,
        /\/components\/MeCoding\/.*\.js$/,
      ],
    })
  ],
  server: {
    port: 5173,
    open: false,
  },
});
