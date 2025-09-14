import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Configurações do servidor
  server: {
    port: 3000,
    host: true, // Permite acesso externo
    open: true  // Abre o navegador automaticamente
  },
  
  // Otimizações para assets estáticos
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        // Organiza os arquivos na pasta de build
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const extType = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `img/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      }
    }
  }
})