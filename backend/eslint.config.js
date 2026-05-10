import { defineConfig, globalIgnores } from 'eslint/config';
import cheminfo from 'eslint-config-cheminfo';
import globals from 'globals';

export default defineConfig([
  globalIgnores(['coverage', 'data']),
  cheminfo,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
]);
