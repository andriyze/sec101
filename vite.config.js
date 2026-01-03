import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// eslint-disable-next-line no-undef
const previewPort = Number.parseInt(process.env.PORT ?? '4173', 10)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    host: true,
    port: Number.isNaN(previewPort) ? 4173 : previewPort,
    allowedHosts: ['sec101.a3sec.net'],
  },
})
