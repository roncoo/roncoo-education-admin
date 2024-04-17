/**
 * 表单封装
 */
import { onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Sortable from 'sortablejs'

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

          if (apis.sort) {
            await handleSort()
          }
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
    handlePage()
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
      ElMessageBox.confirm(tip || '确认删除当前数据?', '提示', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确认'
      }).then(async () => {
        page.loading = true
        try {
          const res = await apis.delete({ id: data.id })
          ElMessage.success({ message: res.msg ? res.msg : '操作成功' })
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
        ElMessage.success({ message: res.msg ? res.msg : '操作成功' })
      }
    } finally {
      page.loading = false
    }
  }

  // 排序
  const handleSort = async () => {
    const tbody = document.querySelector('.drag-table .el-table__body-wrapper tbody')
    Sortable.create(tbody, {
      onEnd({ oldIndex, newIndex }) {
        const row = page.list.splice(oldIndex, 1)[0]
        page.list.splice(newIndex, 0, row)
        const newSorts = page.list.map((item, index) => {
          return {
            id: item.id,
            sort: page.pageSize * (page.pageCurrent - 1) + index + 1
          }
        })
        apis.sort(newSorts).then(() => {
          ElMessage.success('排序完成')
        })
      }
    })
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
    handleStatus,
    handleSort
  }
}
