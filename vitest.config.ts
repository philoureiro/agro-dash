import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom', // ESSENCIAL para hooks React!
    globals: true, // Pode usar describe/it/expect direto
    coverage: {
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
      exclude: [
        'src/mocks',
        'src/**/*.d.ts',
        'src/**/*.stories.*',
        'src/**/__tests__/*',
        'src/**/mocks/*',
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
