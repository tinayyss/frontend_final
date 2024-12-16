import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    host: true,  // Automatically detect and expose your local IP
    port: 3000,  // Optional: specify the port
    open: true,

  },
})



