import { deleteRequest, getRequest, postRequest, putRequest } from '@/utils/request'

export const usersApi = {
  // 用户账号金额消费
  usersAccountConsumeSave: (data) => {
    return postRequest('/user/admin/users/account/consume/save', data)
  },
  // 用户账号金额消费记录
  usersAccountConsumePage: (data) => {
    return postRequest('/user/admin/users/account/consume/page', data)
  },

  // 讲师分页
  lecturerPage: (params, pageCurrent = 1, pageSize = 20) => {
    return postRequest('/user/admin/lecturer/page', { pageCurrent, pageSize, ...params })
  },
  // 讲师查看
  lecturerView: (data) => {
    return getRequest('/user/admin/lecturer/view?id=' + data.id)
  },
  // 讲师修改
  lecturerEdit: (data) => {
    return putRequest('/user/admin/lecturer/edit', data)
  },
  // 讲师排序
  lecturerSort: (data) => {
    return putRequest('/user/admin/lecturer/sort', data)
  },

  // 讲师保存
  lecturerSave: (data) => {
    return postRequest('/user/admin/lecturer/save', data)
  },

  // 讲师删除
  lecturerDelete: (data) => {
    return deleteRequest('/user/admin/lecturer/delete?id=' + data.id)
  },

  // 用户分页
  usersPage: (params, pageCurrent = 1, pageSize = 20) => {
    return postRequest('/user/admin/users/page', { pageCurrent, pageSize, ...params })
  },

  // 用户修改
  usersEdit: (data) => {
    return putRequest('/user/admin/users/edit', data)
  },

  usersView(data) {
    return getRequest('/user/admin/users/view?id=' + data.id)
  },
  // 用户删除
  usersDelete: (data) => {
    return deleteRequest('/user/admin/users/delete?id=' + data.id)
  },

  // 登录日志
  logLoginPage: (params, pageCurrent = 1, pageSize = 20) => {
    return postRequest('/user/admin/users/log/page', { pageCurrent, pageSize, ...params })
  },

  // 用户课程分页
  userCoursePage: (params, pageCurrent = 1, pageSize = 20) => {
    return postRequest('/course/admin/user/course/page', { pageCurrent, pageSize, ...params })
  },

  // 订单
  orderInfoPage: (params, pageCurrent = 1, pageSize = 20) => {
    return postRequest('/user/admin/order/info/page', { pageCurrent, pageSize, ...params })
  },
  orderEdit: (data) => {
    return putRequest('/user/admin/order/info/edit', data)
  },
  orderInfoStat: (data) => {
    return getRequest('/user/admin/order/info/stat?userId=' + data.userId)
  }
}
