import {createApp} from 'vue'
import App from './App.vue'

const app = createApp(App)

import i18n from './locales/index.js'

app.use(i18n)

import store from './store'

app.use(store)

import router from './router/index'
import '@/permission.js'

app.use(router)

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import {ElLoading} from 'element-plus'

app.use(ElementPlus, {i18n: i18n.global.t, zIndex: 3000})

import '@/styles/index.scss' // global css

import 'vite-plugin-svg-icons/register';
import SvgIcon from '@/components/SvgIcon/index.vue'// svg component
app.component('svg-icon', SvgIcon)

app.config.globalProperties.checkPermission = (name) => {
  name = name.replace(/\//g, ':');
  return (store.getters.userPermission || []).indexOf(name) !== -1;
  // return true;
}
app.config.globalProperties.parsePhone = (telCode, phone) => {
  if (!telCode) {
    return phone
  }
  return '+' + telCode + '-' + phone
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



