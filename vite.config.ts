import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path';

export default defineConfig({
    base: './',
    plugins: [
        vue()
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, '.', 'src')
        }
    },
    css: {
        postcss: {
            plugins: [
                {
                    postcssPlugin: 'internal:charset-removal',
                    AtRule: {
                        charset: (atRule: any) => {
                            if (atRule.name === 'charset') {
                                atRule.remove();
                            }
                        }
                    }
                }
            ]
        }
    },
    server: {
        port: 9528, // 服务端口
        proxy: { // 代理
            '/gateway': {
                target: 'https://dev-os.roncoos.com/gateway/',
                changeOrigin: true,
                rewrite: (path: string) => path.replace(/^\/gateway/, '')
            }
        }
    }
})
