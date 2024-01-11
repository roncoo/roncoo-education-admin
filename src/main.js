import {createApp} from 'vue'
import App from './App.vue'

const app = createApp(App)

import store from './store'

app.use(store)

import router from './router/index'
import '@/permission.js'

app.use(router)

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

app.use(ElementPlus, {zIndex: 3000})

import {ElLoading, ElMessage} from 'element-plus'

import '@/styles/index.scss' // global css

import 'vite-plugin-svg-icons/register';
import SvgIcon from '@/components/SvgIcon/index.vue'// svg component
app.component('svg-icon', SvgIcon)

app.config.globalProperties.checkPermission = (name) => {
  name = name.replace(/\//g, ':');
  return (store.getters.userPermission || []).indexOf(name) !== -1;
  // return true;
}
app.config.globalProperties.tips = function(text) {
  ElMessage.success(text);
};

app.config.globalProperties.loading = {
  // show 和 hide 成对使用
  show(txt = 'Loading') {
    this.__loading__ = ElLoading.service({
      lock: true,
      text: txt,
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
  },
  hide() {
    this.__loading__.close();
  },
  // start 和 stop 成对使用
  start(txt = 'Loading') {
  },
  stop() {
  }
}

app.mount('#app')



