import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  server: {
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                sucure: false,
                changeOrigin: true,  // necessário para enviar cookies

            },
        },
    },
  plugins: [
    tailwindcss(),
  ],
})