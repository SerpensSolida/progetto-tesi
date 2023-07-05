import { resolve } from 'path';

export default {
  build: {
    sourcemap: true,
    server: {
      host: true,
      port: 80
    },
    preview: {
      port: 80
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        webgis: resolve(__dirname, 'webgis/index.html'),
      },
    },
  },
  plugins: []
}
