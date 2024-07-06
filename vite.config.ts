import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: 'https://joshradin.github.io/clippy_clicker/',
  plugins: [react()],
});
