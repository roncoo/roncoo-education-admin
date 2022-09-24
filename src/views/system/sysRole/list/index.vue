<template>
  <div class="app-container">
    <el-form class="filter-container" inline label-width="80px">
      <el-form-item class="filter-item" label="角色名称">
        <el-input v-model="map.roleName" clearable/>
      </el-form-item>
      <el-form-item>
        <el-button v-if="checkPermission('system:admin:sys:role:page')" type="primary" @click="listForQuery">查询</el-button>
        <el-button v-if="checkPermission('system:admin:sys:role:page')" @click="handleReset">刷新</el-button>
        <el-button v-if="checkPermission('system:admin:sys:role:save')" plain type="success" @click="handleAddRow">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" border element-loading-text="Loading" fit highlight-current-row>
      <el-table-column align="center" label="序号" type="index" width="60"/>
      <el-table-column label="角色名称" prop="roleName"/>
      <el-table-column label="备注" prop="remark"/>
      <el-table-column label="状态">
        <template #default="scope">
          <span :class="{'c-danger': scope.row.statusId === 0}">{{ statusIdEnums[scope.row.statusId] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sort"/>
      <el-table-column label="操作" width="360">
        <template #default="scope">
          <el-button v-if="checkPermission('system:admin:sys:role:edit')" plain type="warning" @click="handleSettRow(scope.row)">分配菜单</el-button>
          <el-button v-if="checkPermission('system:admin:sys:role:edit')" plain type="primary" @click="handleUpdateRow(scope.row.id)">编辑</el-button>
          <el-button v-if="checkPermission('system:admin:sys:role:edit') && scope.row.statusId ===1 " plain type="danger" @click="handleUpdateStatus(scope.row)">禁用</el-button>
          <el-button v-if="checkPermission('system:admin:sys:role:edit') && scope.row.statusId ===0 " plain type="success" @click="handleUpdateStatus(scope.row)">启用</el-button>
          <el-button v-if="checkPermission('system:admin:sys:role:delete')" plain type="danger" @click="handleDeleteRow(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page.pageCurrent" :page-size="page.pageSize" :page-sizes="[20, 50, 100, 200]" :total="page.totalCount" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    <add-sys-role v-if="addCtr.visible" :title="addCtr.title" :visible="addCtr.visible" @closes="closeAdd"/>
    <edit-sys-role v-if="editCtr.visible" :info="editCtr.info" :title="editCtr.title" :visible="editCtr.visible" @closes="closeEdit"/>
    <sett-sys-role v-if="settCtr.visible" :info="settCtr.info" :title="settCtr.title" :visible="settCtr.visible" @closes="closeSett"/>
  </div>
</template>

<script>
import {sysRoleDelete, sysRolePage, sysRoleStatusId, sysRoleView} from '@/api/system.js'
import AddSysRole from '@/views/system/sysRole/add/index.vue';
import EditSysRole from '@/views/system/sysRole/edit/index.vue';
import SettSysRole from '@/views/system/sysRole/sett/index.vue';

export default {
  name: 'SysRole',
  components: {EditSysRole, AddSysRole, SettSysRole},
  data() {
    return {
      page: {
        pageCurrent: 1,
        pageSize: 20,
        totalCount: 0,
        totalPage: 0
      },
      list: [],
      map: {},
      listLoading: true,
      statusIdEnums: {},
      addCtr: {
        title: '新增角色',
        visible: false
      },
      editCtr: {
        title: '编辑角色',
        visible: false,
        info: {}
      },
      settCtr: {
        title: '菜单权限',
        visible: false,
        info: {}
      }
    }
  },
  created() {
    this.listForPage()
  },
  mounted() {
    this.$store.dispatch('GetOpts', {enumName: 'StatusIdEnum', type: 'obj'}).then(res => {
      this.statusIdEnums = res;
    });
  },
  methods: {
    handleDeleteRow(row) {
      {
        const body = '确定要删除【' + row.roleName + '】？'
        this.$confirm(body, '删除确认', {
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        }).then(() => {
          this.loading.show();
          sysRoleDelete(row.id).then(res => {
            this.$message.success(res);
            this.loading.hide();
            this.listForPage();
          }).catch(this.loading.hide)
        }).catch(() => {

        })
      }
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
      this.map = {}
      this.page.pageCurrent = 1
      this.listForPage();
    },
    handleAddRow() {
      this.addCtr.visible = true;
    },
    closeAdd(val) {
      if (val) {
        this.page.pageCurrent = 1;
        this.listForPage();
      }
      this.addCtr.visible = false;
    },
    handleUpdateRow(id) {
      sysRoleView(id).then(res => {
        this.editCtr.info = res;
        this.editCtr.visible = true;
      })
    },
    closeEdit(val) {
      if (val) {
        this.page.pageCurrent = 1;
        this.listForPage();
      }
      this.editCtr.visible = false;
    },
    handleSettRow(row) {
      this.settCtr.info = row;
      this.settCtr.visible = true;
    },
    closeSett(val) {
      if (val) {
        this.page.pageCurrent = 1;
        this.listForPage();
      }
      this.settCtr.visible = false;
    },
    handleUpdateStatus(row) {
      {
        let body = '确定禁用角色【' + row.roleName + '】？';
        let statusId = 0;
        if (row.statusId === 0) {
          statusId = 1;
          body = '确定启用角色【' + row.roleName + '】？';
        }
        this.$confirm(body, '删除确认', {
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        }).then(() => {
          this.loading.start();
          sysRoleStatusId(row.id, statusId).then(res => {
            this.$message.success(res);
            this.listForPage();
          })
        }).catch(() => {

        })
      }
    },
    listForQuery() {
      this.page.pageCurrent = 1;
      this.listForPage();
    },
    listForPage() {
      // this.listLoading = true
      this.loading.start()
      sysRolePage(this.map, this.page.pageCurrent, this.page.pageSize).then(res => {
        this.list = res.list
        this.page.pageCurrent = res.pageCurrent
        this.page.totalCount = res.totalCount
        this.page.pageSize = res.pageSize
      })
    }
  }
}
</script>
