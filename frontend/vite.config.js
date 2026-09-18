import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://assessment-portal-alb-1084175467.us-east-1.elb.amazonaws.com',
  //       // target: 'http://localhost:8000',

  //       changeOrigin: true,
  //       secure: true,
  //     },
  //   },
  // },
})