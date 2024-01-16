import {createApp} from 'vue'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import '@/assets/styles/index.less'
import App from '@/App.vue'
import router, {createNewRouter} from '@/router/index'
import store from '@/store/index'
import {getToken} from '@/utils/cookie';
import {loginApi} from '@/api/login';
import {useUserStore} from '@/store/modules/user';

if (!getToken()) {
    // 初始化（用户没登录）
    init()
} else {
    // 初始化（用户已登录）
    loginApi.getUserInfo().then((res: { routerList: any; }) => {
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
    app.mount('#app')
}
