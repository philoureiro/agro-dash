import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

import manifest from './manifest.json';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest,
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      // switch to "true" to enable sw on development
      devOptions: { enabled: false },
      registerType: 'autoUpdate',
      workbox: { globPatterns: ['**/*.{js,css,html}', '**/*.{svg,png,jpg,gif}'] },
    }),
  ],
  resolve: {
    alias: {
      '@hooks': path.resolve(__dirname, './src/application/hooks'),
      '@utils': path.resolve(__dirname, './src/application/utils'),
      '@components': path.resolve(__dirname, './src/presentation/components'),
      '@pages': path.resolve(__dirname, './src/presentation/pages'),
      '@sections': path.resolve(__dirname, './src/presentation/sections'),
      '@theme': path.resolve(__dirname, './src/presentation/theme'),
      '@config': path.resolve(__dirname, './src/config'),
      '@enums': path.resolve(__dirname, './src/domain/enums'),
      '@entities': path.resolve(__dirname, './src/domain/entities'),
      '@mocks': path.resolve(__dirname, './src/infrastructure/mocks'),
      '@seed': path.resolve(__dirname, './src/infrastructure/seed'),
      '@validations': path.resolve(__dirname, './src/domain/validations'),
      '@storage': path.resolve(__dirname, './src/application/storage'),
      '@services': path.resolve(__dirname, './src/application/services'),
      '@animations': path.resolve(__dirname, './src/presentation/layouts/animations'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 4173,
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 4173,
    allowedHosts: ['agro-dash-e411d523d8a5.herokuapp.com', 'localhost'],
  },
});
