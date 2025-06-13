import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // ESSENCIAL para hooks React!
    globals: true, // Pode usar describe/it/expect direto
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: [
        'src/mocks',
        'src/**/*.d.ts',
        'src/**/*.stories.*',
        'src/**/__tests__/*',
        'src/**/mocks/*',
        'src/test',
        'src/**/*.test.{ts,tsx,js,jsx}',
        'src/**/*.spec.{ts,tsx,js,jsx}',
      ],
    },
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
});
