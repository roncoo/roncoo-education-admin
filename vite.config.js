import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default defineConfig({
  base: './',
  server: {
    port: 9528, // 服务启动端口号
    open: true, // 服务启动时是否自动打开浏览器
    proxy: {
      '/gateway': {
        target: 'http://localhost:7700',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/gateway/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve('src')
    }
  },
  plugins: [
    vue(),
    createSvgIconsPlugin({
      iconDirs: [resolve('src/assets/svg')],
      symbolId: 'icon-[name]'
    })
  ],
  build: {
    minify: 'terser',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1500,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  telemetry: false
})
