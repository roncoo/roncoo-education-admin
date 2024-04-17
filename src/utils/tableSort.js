// 引入 sortable
import Sortable from 'sortablejs'
import { ElMessage } from 'element-plus'

// Sortable实例
let sortableInstance

/**
 * 拖拽函数
 * @param getList 获取列表数据
 * @param isSort  控制表单是否开启拖拽排序
 */
export default function useTableSort(isSort, sortList, sortApi) {
  const tbody = document.querySelector('.el-table__body-wrapper tbody')
  if (sortableInstance) {
    sortableInstance.destroy()
  }

  sortableInstance = new Sortable(tbody, {
    disabled: !isSort,
    onEnd({ oldIndex, newIndex }) {
      const row = sortList.splice(oldIndex, 1)[0]
      sortList.splice(newIndex, 0, row)

      const sorts = sortList.map((item, i) => {
        return {
          id: item.id,
          sort: i + 1,
          realName: item.realName
        }
      })

      if (sortApi) {
        sortApi(sorts).then((res) => {
          ElMessage.success(res)
        })
      }

      console.log(sortList)
    }
  })
}
