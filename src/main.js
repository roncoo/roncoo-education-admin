import {createApp} from 'vue'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'vite-plugin-svg-icons/register';
import App from './App.vue'
import router, {createNewRouter} from './router/index'
import store from './store/index'
import SvgIcon from '@/components/SvgIcon/index.vue'// svg component
import '@/assets/styles/index.scss'
import {getToken} from '@/utils/cookie';
import {loginApi} from '@/api/login';
import {useUserStore} from '@/store/modules/user';

if (getToken()) {
  loginApi.getUserInfo().then((res) => {
    createNewRouter(res.routerList)
    init()
    useUserStore().login(res)
  })
} else {
  init()
}

function init() {
  const app = createApp(App)
  app.use(router)
  app.use(store)
  app.use(ElementPlus)
  // 组件
  app.component('svg-icon', SvgIcon)

  app.mount('#app')
}





