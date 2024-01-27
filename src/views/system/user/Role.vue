<template>
  <el-dialog title="角色设置" :model-value="visible" width="800px" center @close="onClose()">
    <div class="page_head" style="text-align: left">
      <div class="search_bar clearfix">
        <el-form :model="query" inline label-width="80px">
          <el-form-item label="角色名称">
            <el-input v-model="query.roleName" clearable/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery()"> 查询</el-button>
            <el-button @click="resetQuery()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-table ref="tableRef" v-loading="page.loading" :data="page.list" border>
      <el-table-column type="selection" :width="50"/>
      <el-table-column label="角色名称" prop="roleName"/>
      <el-table-column label="备注" prop="remark"/>
    </el-table>
    <pagination :total="page.totalCount" :current-page="page.pageCurrent" :page-size="page.pageSize" @pagination="handlePage"/>
    <template #footer>
      <span class="handle_bar">
        <el-button @click="onClose()">取消</el-button>
        <el-button type="primary" @click="onSubmit()">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {systemApi} from '@/api/system'
import {onMounted, reactive, ref} from 'vue'
import useTable from '@/utils/table'
import Pagination from "@/components/Pagination/index.vue"
import {ElMessage} from "element-plus";

onMounted(() => {

})

const tableRef = ref()
const emit = defineEmits(['onReload'])
const onSubmit = async () => {
  const roles = tableRef.value.getSelectionRows()
  if (roles.length > 0) {
    roleIds.value = []
    roles.forEach((item: any) => {
      roleIds.value.push(item.id);
    })
    await systemApi.sysRoleUserSave({'userId': userId.value, 'roleIdList': roleIds.value})
    ElMessage({type: 'success', message: '设置成功'});
  }
  emit('onReload')
  onClose()
}

// 用户ID
const userId = ref()
const roleIds = ref([])

// 打开和关闭
const visible = ref(false);// 弹窗显示状态
const onOpen = (item: any) => {
  if (item) {
    userId.value = item.id
    systemApi.sysRoleUserList({'userId': userId.value}).then((res: any) => {
      roleIds.value = res

      // todo 选中处理
    })
  }
  visible.value = true
}
defineExpose({onOpen})
const onClose = () => {
  visible.value = false;
  tableRef.value.clearSelection()
}

// 基础功能
const apis = reactive({
  page: systemApi.sysRolePage,
})
const {page, handlePage, query, handleQuery, resetQuery, handleDelete, handleStatus} = reactive({
  ...useTable(apis)
})

//
// export default {
//   name: 'AllocationSysRole',
//   props: {
//     title: {
//       type: String,
//       default: null
//     },
//     visible: {
//       type: Boolean,
//       default: false
//     },
//     id: {
//       type: String,
//       default: undefined
//     }
//   },
//   data() {
//     return {
//       page: {
//         pageCurrent: 1,
//         pageSize: 20,
//         totalCount: 0,
//         totalPage: 0
//       },
//       loading: false,
//       dialogLoading: false,
//       list: [],
//       map: {},
//       listLoading: true,
//       selectRoleIdList: [],
//       currentSelectRoleIdList: [],
//       statusIdEnums: {}
//     }
//   },
//   emits: ['closes'],
//   mounted() {
//     // 获取已选中角色
//     systemApi.sysRoleUserList(this.id).then(res => {
//       this.selectRoleIdList = res;
//       // 获取角色分页数据
//       this.map = {
//         statusId: 1
//       };
//       this.page.pageCurrent = 1;
//       this.page.pageSize = 20;
//       this.listForPage();
//     });
//     // 获取状态枚举
//     this.statusIdEnums = getEnumObj('StatusIdEnum')
//   },
//   methods: {
//     // 选中角色
//     selectionChange(selectList) {
//       this.currentSelectRoleIdList = [];
//       selectList.forEach(item => {
//         this.currentSelectRoleIdList.push(item.id);
//       })
//     },
//     handleSizeChange(size) {
//       this.page.pageSize = size
//       this.page.pageCurrent = 1
//       this.listForPage();
//     },
//     handleCurrentChange(current) {
//       this.page.pageCurrent = current
//       this.listForPage();
//     },
//     handleReset() {
//       this.map = {
//         statusId: 1
//       }
//       this.page.pageCurrent = 1
//       this.listForPage();
//     },
//     listForQuery() {
//       this.page.pageCurrent = 1;
//       this.listForPage();
//     },
//     listForPage() {
//
//       systemApi.sysRolePage(this.map, this.page.pageCurrent, this.page.pageSize).then(res => {
//         this.list = res.list
//         this.page.pageCurrent = res.pageCurrent
//         this.page.totalCount = res.totalCount
//         this.page.pageSize = res.pageSize
//         // 选中
//         this.$nextTick(() => {
//           this.$refs.availableRoleTable.clearSelection();
//           if (this.list !== undefined && this.list !== null && this.list.length > 0) {
//             this.list.forEach(item => {
//               // 校验是否已选中
//               if (this.selectRoleIdList.indexOf(item.id) !== -1) {
//                 this.$refs.availableRoleTable.toggleRowSelection(item, true)
//               }
//             })
//           }
//         });
//       }).finally(() => {
//
//       })
//     },
//     handleClose() {
//       this.form = {}
//       this.$emit('closes');
//     },
//     handleRoleSett() {
//       {
//         let body = '当前没有选中角色，确认要设置？'
//         if (this.currentSelectRoleIdList !== undefined && this.currentSelectRoleIdList !== null && this.currentSelectRoleIdList.length > 0) {
//           body = '当前选中【' + this.currentSelectRoleIdList.length + '】个角色，确认要设置？';
//         }
//         this.$confirm(body, '设置角色', {
//           confirmButtonText: '确认',
//           cancelButtonText: '取消'
//         }).then(() => {
//           this.dialogLoading = true
//           systemApi.sysRoleUserSave({userId: this.id, roleIdList: this.currentSelectRoleIdList}).then(res => {
//             this.dialogLoading = false;
//             this.$message.success(res, 'success')
//             this.$emit('closes', 'success')
//           }).catch(() => {
//             this.dialogLoading = false;
//           })
//         })
//       }
//     }
//   }
// }
</script>

<style scoped>

</style>
