import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Static build served via Nginx on the Absolute Hosting VPS (build brief, §B.8).
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      /**
       * fynbos-assets/ is source material (brief, questionnaire, image
       * masters), never imported by the app. Watching it crashes the dev
       * server with EBUSY the moment one of the documents is open in Word.
       */
      ignored: ['**/fynbos-assets/**'],
    },
  },
})
