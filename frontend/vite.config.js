import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Proxy requests starting with /tickets to the backend server
      "/tickets": {
        target: "http://localhost:3000", // Backend server URL
        changeOrigin: true,
      },
      "/api": {
        target: "http://localhost:3000", // Your backend server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // Removes "/api" prefix
      },
      // "/admin/login": {
      //   target: "http://localhost:3000", // Backend server URL
      //   changeOrigin: true,
      // }
        
        
      
    },
  },
})
