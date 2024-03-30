<template>
  <el-dialog :append-to-body="true" :model-value="visible" title="角色设置" width="800px" center align-center @close="onClose()" :destroy-on-close="true">
    <div class="page_head" style="text-align: left">
      <div class="search_bar clearfix">
        <el-form :model="query" inline label-width="80px">
          <el-form-item label="角色名称">
            <el-input v-model="query.roleName" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery()"> 查询</el-button>
            <el-button @click="resetQuery()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table ref="tableRef" v-loading="page.loading" :data="page.list">
      <el-table-column type="selection" :width="50" />
      <el-table-column label="角色名称" prop="roleName" />
      <el-table-column label="备注" prop="remark" />
    </el-table>
    <pagination :total="page.totalCount" v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" @pagination="handlePage" />
    <template #footer>
      <span class="handle_bar">
        <el-button @click="onClose()">取消</el-button>
        <el-button type="primary" @click="onSubmit()">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import { systemApi } from '@/api/system'
  import { reactive, ref } from 'vue'
  import useTable from '@/utils/table'
  import Pagination from '@/components/Pagination/index.vue'
  import { ElMessage } from 'element-plus'

  const tableRef = ref()
  const emit = defineEmits(['refresh'])
  const onSubmit = async () => {
    const roles = tableRef.value.getSelectionRows()
    if (roles.length > 0) {
      roleIds.value = []
      roles.forEach((item) => {
        roleIds.value.push(item.id)
      })
      await systemApi.sysRoleUserSave({ userId: userId.value, roleIdList: roleIds.value })
      ElMessage.success('设置成功')
    }
    emit('refresh')
    onClose()
  }

  // 用户ID
  const userId = ref()
  const roleIds = ref([])
  // 打开和关闭
  const visible = ref(false) // 弹窗显示状态
  const onOpen = (item) => {
    if (item) {
      userId.value = item.id
      systemApi.sysRoleUserList({ userId: item.id }).then((res) => {
        roleIds.value = res
        // 选中状态处理
        res.forEach((item) => {
          for (let i = 0; i < page.list.length; i++) {
            if (item == page.list[i].id) {
              tableRef.value.toggleRowSelection(page.list[i], true)
            }
          }
        })
      })
    }
    visible.value = true
  }
  defineExpose({ onOpen })
  const onClose = () => {
    visible.value = false
    tableRef.value.clearSelection()
  }

  // 基础功能
  const { page, handlePage, query, handleQuery, resetQuery } = reactive({
    ...useTable({
      page: systemApi.sysRolePage
    })
  })
</script>

<style lang="scss" scoped></style>
