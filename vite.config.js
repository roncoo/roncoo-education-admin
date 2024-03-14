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
      // 代理
      '/gateway': {
        target: 'https://dev-os.roncoos.com/gateway/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/gateway/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '.', 'src')
    }
  },
  plugins: [
    vue(),
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), 'src/assets/svg')],
      symbolId: 'icon-[name]'
    })
  ]
})
