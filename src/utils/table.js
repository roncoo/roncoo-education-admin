/**
 * 表单封装
 */
import { onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export default function useTable(apis, paras = {}) {
  // 分页对象
  const page = reactive({
    pageCurrent: 1,
    pageSize: 20,
    totalCount: 0,
    list: [],
    loading: true
  })

  // 分页查询
  const handlePage = async () => {
    if (apis.page) {
      page.loading = true
      try {
        const res = await apis.page({
          pageCurrent: page.pageCurrent,
          pageSize: page.pageSize,
          ...paras,
          ...query
        })
        if (res) {
          page.list = res.list || res || []
          page.totalCount = res.totalCount || 0
        }
      } finally {
        page.loading = false
      }
    }
  }

  // 查询对象
  const query = reactive({})

  // 查询
  const handleQuery = () => {
    page.pageCurrent = 1
    // 分页查询
    handlePage().then(() => {
      //ElMessage({ type: 'success', message: '查询成功' })
    })
  }

  // 重置
  const resetQuery = () => {
    for (let i in query) {
      query[i] = ''
    }
    handleQuery()
  }

  //删除功能
  const handleDelete = (data, tip = '') => {
    if (apis.delete) {
      ElMessageBox.confirm(tip || '确认删除当前数据?', '删除提示', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确认'
      }).then(async () => {
        page.loading = true
        try {
          const res = await apis.delete({ id: data.id })
          ElMessage({ type: 'success', message: res.msg ? res.msg : '删除成功' })
          await handlePage()
        } finally {
          page.loading = false
        }
      })
    }
  }

  // 状态修改
  const handleStatus = async (row) => {
    page.loading = true
    try {
      if (apis.status) {
        row.statusId = row.statusId ? 0 : 1
        const res = await apis.status({ id: row.id, statusId: row.statusId })
        ElMessage({ type: 'success', message: res.msg ? res.msg : '操作成功' })
      }
    } finally {
      page.loading = false
    }
  }

  // 获取数据
  onMounted(handlePage)

  return {
    page,
    handlePage,
    query,
    handleQuery,
    resetQuery,
    handleDelete,
    handleStatus
  }
}
