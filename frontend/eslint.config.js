import { defineConfig, globalIgnores } from 'eslint/config';
import react from 'eslint-config-cheminfo-react';
import typescript from 'eslint-config-cheminfo-typescript';

export default defineConfig([
  globalIgnores(['coverage']),
  typescript,
  react,
]);
