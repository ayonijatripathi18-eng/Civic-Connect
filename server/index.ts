import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { createApp } from './app.js';
import { config } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

export async function startServer() {
  const app = createApp();
  const server = http.createServer(app);
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // In development mode, mount Vite middleware with HMR/WS multiplexed on the HTTP server
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        ws: false,
      },
      appType: 'spa',
      root: rootDir
    });
    app.use(vite.middlewares);
  } else {
    // In production mode, serve built static client assets
    const distPath = path.resolve(rootDir, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  server.listen(config.port, '0.0.0.0', () => {
    console.log(`[Civic-Connect Server] Running on http://0.0.0.0:${config.port}`);
    console.log(`[Civic-Connect Server] Health check: http://0.0.0.0:${config.port}/api/health`);
    console.log(`[Civic-Connect Server] Speech endpoint: http://0.0.0.0:${config.port}/api/speech/transcribe`);
  });

  return { app, server };
}

// Auto-start if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url) || !process.env.STANDALONE_MODULE) {
  startServer().catch((err) => {
    console.error('[Civic-Connect Server] Failed to start:', err);
    process.exit(1);
  });
}
