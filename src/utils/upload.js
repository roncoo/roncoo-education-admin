import axios from 'axios'
import {ElMessage, ElMessageBox} from 'element-plus'
import store from '@/store'
import {getToken} from '@/utils/auth'
import router from '@/router';

const BaseURL = '/gateway'

const pending = []; // 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
const removePending = (config, isCancel) => {
  for (const p in pending) {
    if (pending[p].u === config.url + '&' + config.method) { // 当当前请求在数组中存在时执行函数体
      if (isCancel) {
        pending[p].f(); // 执行取消操作
      }
      pending.splice(p, 1); // 把这条记录从数组中移除
    }
  }
}

// create an axios instance
const service = axios.create({
  baseURL: BaseURL, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 1800 * 10000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // removePending(config, true); // 在一个ajax发送前执行一下取消操作
    if (store.getters.token) {
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // removePending({
    //   url: response.config.url.replace(BaseURL, ''),
    //   method: response.config.method
    // }, false); // 在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
    const res = response.data
    // 关闭loading动画
    store.dispatch('app/toggleLoading', false)
    if (response.config.url.indexOf('baijiayun.com') > -1) {
      return res
    }
    const token = getToken()
    // if the custom code is not 200, it is judged as an error.
    if (res.code !== 200) {
      console.log(res.code);
      // 300:非法的token; 500:其他客户端登录了;  50014:Token 过期了;
      if (res.code <= 500 && res.code >= 300 && token) {
        if (res.code === 306) {
          console.log(11);
          router.push({path: '/403'})
          ElMessage.warning('权限不足，请联系管理员')
        } else {
            ElMessageBox.confirm(
              '你已被登出，请重新登录',
              '确定登出',
              {
                confirmButtonText: '重新登录',
                showCancelButton: false,
                type: 'warning'
              }
            ).then(() => {
              store.dispatch('user/logout').then(() => {
                location.href = '/admin/login'
              })
            })
        }
      } else if (res.code === 600) {
        ElMessageBox.confirm(
          res.msg,
          '登录异常',
          {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('user/logout').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      } else {
        ElMessage({
          message: res.msg,
          type: 'error',
          duration: 5 * 1000
        })
      }
      Promise.reject(response.data)
      return response.data && response.data.data
    } else {
      return response.data && response.data.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    // if(error.message) {
    ElMessage({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    // }
    return Promise.reject(error)
  }
)

export default service
