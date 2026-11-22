import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import * as master from './src/master.js'

// Fills %SITE_URL%, %SITE_DOMAIN%, %GRIEVANCE_EMAIL% (any export of src/master.js)
// in index.html, so the SEO tags and Google structured data use the same values as the app.
function masterHtml() {
  return {
    name: 'master-html',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => html.replace(/%([A-Z_]+)%/g, (match, key) => (key in master ? String(master[key]) : match)),
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), masterHtml()],
})
