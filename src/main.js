import {createApp} from 'vue'
import ElementPlus from 'element-plus';
import 'vite-plugin-svg-icons/register';
import App from './App.vue'
import router, {createNewRouter} from './router/index'
import store from './store/index'
import SvgIcon from '@/components/SvgIcon/index.vue'// svg component
import 'element-plus/dist/index.css';
import '@/styles/index.scss'
import {getToken} from '@/utils/cookie';
import {loginApi} from '@/api/login';

if (getToken()) {
  loginApi.getUserInfo().then((res) => {
    const routerList = res.routerList.filter((e) => e.path);
    createNewRouter(routerList)
    init()
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





