import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Site details (domain, grievance email, …) are NOT baked in at build time.
// They live in the backend (Admin → Panel) and RouteSeo.jsx applies them at runtime.

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
