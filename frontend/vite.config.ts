import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const backendPort = Number(process.env.PORT ?? 31015);
const devServerPort = Number(process.env.VITE_PORT ?? backendPort + 1);
const apiTarget = process.env.PDB_API_URL ?? `http://localhost:${backendPort}`;
const apiPaths = [
  '/pdb',
  '/assembly',
  '/view',
  '/stats',
  '/find',
  '/rsync-history',
  '/v1',
];

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../backend/public',
    emptyOutDir: true,
  },
  server: {
    port: devServerPort,
    // Fail loudly instead of drifting to the next free port, which would leave
    // the proxy target, the dev script and the README disagreeing.
    strictPort: true,
    proxy: Object.fromEntries(apiPaths.map((path) => [path, apiTarget])),
  },
});
