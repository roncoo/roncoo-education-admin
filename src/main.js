import {createApp} from 'vue'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import '@/assets/styles/index.scss'
import App from '@/App.vue'
import router, {createNewRouter} from '@/router/index.js'
import store from '@/store/index.js'
import {getToken} from '@/utils/cookie.js';
import {loginApi} from '@/api/login.js';
import {useUserStore} from '@/store/modules/user.js';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

if (!getToken()) {
    // 初始化（用户没登录）
    init()
} else {
    // 初始化（用户已登录）
    loginApi.getUserInfo().then((res) => {
        createNewRouter(res.routerList)
        init()
        useUserStore().login(res)
    })
}

function init() {
    const app = createApp(App)
    app.use(router)
    app.use(store)
    app.use(ElementPlus)
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        app.component(key, component)
    }
    app.mount('#app')

    // 全局配置Dialog遮罩层点击不关闭
    app._context.components.ElDialog.props.closeOnClickModal.default = false
}
