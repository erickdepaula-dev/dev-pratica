import http from 'http';
import { createServer as createViteServer } from 'vite';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createApiApp } from './server/apiApp';

process.env.DISABLE_HMR = 'true';
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';
const port = parseInt(process.env.PORT || '3000', 10);

/**
 * Servidor local: API (server/apiApp.ts) + Vite em desenvolvimento, ou os arquivos de dist/
 * com NODE_ENV=production. Na Vercel este arquivo não roda (ver scripts/build-vercel.mjs).
 */
async function startServer() {
  const app = createApiApp();

  const server = http.createServer(app);

  // Mount Vite development server or static production assets
  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false, // Disables WebSocket transport error in iframe container
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(port, '0.0.0.0', () => {
    console.log(`[DevPrática] Servidor iniciado na porta ${port}`);
  });
}

startServer();

