import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        secure: false,
        changeOrigin: true, // necessário para enviar cookies
      },
    },
    // 👇 importante para React Router
    historyApiFallback: true,
  },
  plugins: [
    tailwindcss(),
  ],
})
