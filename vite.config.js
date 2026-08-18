import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Single-origin dev, matching how production is served: the storefront is at / and the
// admin panel at /admin/. In production both are static files under one document root
// (see DEPLOY-FREE.md / DEPLOY-HOSTINGER.md); in dev the admin is a second Vite server
// that this one proxies to, so http://localhost:5173/admin/ works the same way.
const ADMIN_DEV_PORT = 5174;

export default defineConfig({
  plugins: [react()],
  server: {
    // strictPort so the port can never silently drift. The API's config/cors.php
    // whitelists this exact origin -- if Vite moved to the next free port, every
    // request would fail CORS instead.
    port: 5173,
    strictPort: true,
    host: true,
    proxy: {
      // Must stay in sync with the admin panel's own server.port. The admin sets
      // base: '/admin/' in every mode, so it already expects the /admin prefix and
      // no path rewrite is needed here.
      '/admin': {
        target: `http://localhost:${ADMIN_DEV_PORT}`,
        changeOrigin: true,
        ws: true, // tunnel the admin's HMR websocket
      },
    },
  },
});
