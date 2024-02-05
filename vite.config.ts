import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path';

export default defineConfig({
    base: './',
    server: {
        port: 9528, // 服务启动端口号
        open: true, // 服务启动时是否自动打开浏览器
        proxy: { // 代理
            '/gateway': {
                target: 'https://dev-os.roncoos.com/gateway/',
                changeOrigin: true,
                rewrite: (path: string) => path.replace(/^\/gateway/, '')
            }
        }
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, '.', 'src')
        }
    },
    plugins: [
        vue()
    ]
})
