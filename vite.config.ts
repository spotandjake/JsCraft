import { defineConfig } from 'vite';
import ShaderLoader from './plugins/ShaderLoader';
export default defineConfig({
  server: {
    hmr: false,    
  },
  plugins: [
    ShaderLoader()
  ]
})