import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Static build served via Nginx on the Absolute Hosting VPS (build brief, §B.8).
export default defineConfig({
  plugins: [react()],
})
