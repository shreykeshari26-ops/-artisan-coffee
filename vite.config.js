import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Custom plugin: aggressive cache headers for /frames/* during dev
const frameCachePlugin = () => ({
  name: 'frame-cache-headers',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url?.startsWith('/frames/')) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
      next();
    });
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), frameCachePlugin()],
})
