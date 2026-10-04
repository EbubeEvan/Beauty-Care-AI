import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
    exclude: ['e2e/**', 'node_modules', '.next'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/app/layout.tsx',
        'src/app/**/page.tsx',
        'src/app/**/layout.tsx',
        'src/components/landing-new/**',
        'src/components/ui/**',
        'src/styles/**',
      ],
      thresholds: {
        // Baseline from first full pass (75 tests). Critical lib files
        // (types/utils/fetchData/actions) are 77-100%; global is dragged
        // down by untested hooks/landing/chat UI. Ratchet these up as
        // Phase 2 component/hook tests land.
        lines: 35,
        functions: 30,
        branches: 35,
        statements: 35,
      },
    },
    testTimeout: 30000,
    hookTimeout: 30000,
    pool: 'forks',
  },
});
