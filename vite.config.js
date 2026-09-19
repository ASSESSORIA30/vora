import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split Three.js into its own chunk so the rest of the app loads fast
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          gsap: ['gsap'],
          motion: ['framer-motion'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
