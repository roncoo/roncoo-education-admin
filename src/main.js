import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/styles/index.scss'
import App from '@/App.vue'
import router, { createNewRouter } from '@/router/index.js'
import store from '@/store/index.js'
import { getToken } from '@/utils/cookie.js'
import { loginApi } from '@/api/login.js'
import { useUserStore } from '@/store/modules/user.js'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 初始化
setupInit()

async function setupInit() {
  if (!getToken()) {
    // 用户没登录
    init()
  } else {
    // 用户已登录
    const res = await loginApi.getUserInfo()
    // 创建动态路由
    createNewRouter(res.routerList)
    init()
    useUserStore().login(res)
  }
}

function init() {
  const app = createApp(App)
  app.use(router)
  app.use(store)
  app.use(ElementPlus)

  // 注册图标组件
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

  // 注册自定义指令（权限使用）
  app.directive('permission', (el, binding) => {
    const permissions = useUserStore().getPermissionList
    console.log(permissions)
    if (binding.value) {
      if (!permissions?.includes(binding.value)) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  })

  // 全局配置：Dialog遮罩层点击不关闭
  app._context.components.ElDialog.props.closeOnClickModal.default = false

  // 挂载
  app.mount('#app')
}
