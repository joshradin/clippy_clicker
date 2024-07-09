import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: '/clippy_clicker/',
  plugins: [react()],
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "public"),
    }
  },
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
});
