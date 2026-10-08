import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages は /task-board/ 配下で配信されるため相対パスで出力する
  base: './',
  test: {
    environment: 'jsdom',
  },
})
