import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Vite + React + Tailwind v4 설정. test 키는 Vitest(jsdom)용.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    // Playwright e2e 디렉터리는 Vitest 대상에서 제외
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
  },
})
