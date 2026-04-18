import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/kostebek/',   // 🔥 BUNU EKLE
  plugins: [react()],
})