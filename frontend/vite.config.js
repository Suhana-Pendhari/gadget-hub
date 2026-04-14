import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          mui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          geo: ['country-state-city'],
          vendor: ['axios', 'react-toastify']
        }
      }
    }
  },
  server:{
    proxy:{
      '/api':{
        target:'http://localhost:8000'
      }
    }
  }
})
