<template>
  <el-dialog :model-value="visible" v-loading="dialogLoading" :before-close="handleClose" :title="title" center width="600px">
    <el-form class="filter-container" inline label-width="80px">
      <el-form-item class="filter-item" label="角色名称">
        <el-input v-model="map.roleName"/>
      </el-form-item>
      <el-form-item class="filter-item">
        <el-button class="filter-item" type="primary" @click="listForQuery">查询</el-button>
        <el-button class="filter-item" @click="handleReset">重置</el-button>
        <el-button type="success" plain @click="handleRoleSett()" size="mini">设置</el-button>
      </el-form-item>
    </el-form>
    <el-table ref="availableRoleTable" v-loading="loading" :data="list" border element-loading-text="Loading" fit highlight-current-row @selection-change="selectionChange">
      <el-table-column type="selection" width="55"/>
      <el-table-column label="角色名称" prop="roleName"/>
      <el-table-column label="备注" prop="remark"/>
      <el-table-column label="状态" width="100px">
        <template #default="scope">
          {{ statusIdEnums[scope.row.status] }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page.pageCurrent" :page-size="page.pageSize" :page-sizes="[20, 50, 100, 200]" :total="page.totalCount" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    <template #footer>
      <span class="handle_bar">
        <el-button @click="handleClose()">取消</el-button>
        <el-button type="primary" @click="handleRoleSett">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import {sysRolePage, sysRoleUserList, sysRoleUserSave} from '@/api/system';

export default {
  name: 'AllocationSysRole',
  props: {
    title: {
      type: String,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      page: {
        pageCurrent: 1,
        pageSize: 20,
        totalCount: 0,
        totalPage: 0
      },
      loading: false,
      dialogLoading: false,
      list: [],
      map: {},
      listLoading: true,
      selectRoleIdList: [],
      currentSelectRoleIdList: [],
      statusIdEnums: {}
    }
  },
  emits: ['closes'],
  mounted() {
    // 获取已选中角色
    sysRoleUserList(this.id).then(res => {
      this.selectRoleIdList = res;
      // 获取角色分页数据
      this.map = {
        statusId: 1
      };
      this.page.pageCurrent = 1;
      this.page.pageSize = 20;
      this.listForPage();
    });
    // 获取状态枚举
    this.$store.dispatch('GetOpts', {enumName: 'StatusIdEnum', type: 'obj'}).then(res => {
      this.statusIdEnums = res;
    });
  },
  methods: {
    // 选中角色
    selectionChange(selectList) {
      this.currentSelectRoleIdList = [];
      selectList.forEach(item => {
        this.currentSelectRoleIdList.push(item.id);
      })
    },
    handleSizeChange(size) {
      this.page.pageSize = size
      this.page.pageCurrent = 1
      this.listForPage();
    },
    handleCurrentChange(current) {
      this.page.pageCurrent = current
      this.listForPage();
    },
    handleReset() {
      this.map = {
        statusId: 1
      }
      this.page.pageCurrent = 1
      this.listForPage();
    },
    listForQuery() {
      this.page.pageCurrent = 1;
      this.listForPage();
    },
    listForPage() {
      this.loading = true;
      sysRolePage(this.map, this.page.pageCurrent, this.page.pageSize).then(res => {
        this.list = res.list
        this.page.pageCurrent = res.pageCurrent
        this.page.totalCount = res.totalCount
        this.page.pageSize = res.pageSize
        // 选中
        this.$nextTick(() => {
          this.$refs.availableRoleTable.clearSelection();
          if (this.list !== undefined && this.list !== null && this.list.length > 0) {
            this.list.forEach(item => {
              // 校验是否已选中
              if (this.selectRoleIdList.indexOf(item.id) !== -1) {
                this.$refs.availableRoleTable.toggleRowSelection(item, true)
              }
            })
          }
        });
      }).finally(() => {
        this.loading = false;
      })
    },
    handleClose() {
      this.form = {}
      this.$emit('closes');
    },
    handleRoleSett() {
      {
        let body = '当前没有选中角色，确认要设置？'
        if (this.currentSelectRoleIdList !== undefined && this.currentSelectRoleIdList !== null && this.currentSelectRoleIdList.length > 0) {
          body = '当前选中【' + this.currentSelectRoleIdList.length + '】个角色，确认要设置？';
        }
        this.$confirm(body, '设置角色', {
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        }).then(() => {
          this.dialogLoading = true
          sysRoleUserSave({userId: this.id, roleIdList: this.currentSelectRoleIdList}).then(res => {
            this.dialogLoading = false;
            this.$message.success(res, 'success')
            this.$emit('closes', 'success')
          }).catch(() => {
            this.dialogLoading = false;
          })
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
