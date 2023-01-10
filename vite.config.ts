import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  console.info('Setting dev-server proxy for /api to: ', env.VITE_ASSISTED_SERVICE_API);

  return {
    build: {
      outDir: 'build',
    },
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_ASSISTED_SERVICE_API,
          changeOrigin: true,
        },
      },
    },
  };
});
