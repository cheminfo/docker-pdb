import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const apiTarget = process.env.PDB_API_URL ?? 'http://localhost:12345';
const apiPaths = [
  '/pdb',
  '/assembly',
  '/view',
  '/stats',
  '/find',
  '/rsync-history',
];

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../nginx/www',
    emptyOutDir: true,
  },
  server: {
    proxy: Object.fromEntries(apiPaths.map((path) => [path, apiTarget])),
  },
});
