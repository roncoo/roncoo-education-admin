<template>
  <div class="app-container">
    <el-form class="filter-container" inline label-width="80px">
      <el-form-item class="filter-item" label="登录账号">
        <el-input v-model="map.mobile" clearable/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="listForQuery">查询</el-button>
        <el-button @click="handleReset">刷新</el-button>
        <el-button v-if="checkPermission('system:admin:sys:user:save')" plain type="success" @click="handleAddRow">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" border element-loading-text="Loading" fit highlight-current-row>
      <el-table-column align="center" label="序号" type="index" width="60"/>
      <el-table-column label="登录账号" prop="mobile"/>
      <el-table-column label="用户昵称" prop="realName"/>
      <el-table-column label="所属角色">
        <template #default="scope">
          <el-tag v-for="(i, index) in scope.row.roleNameList" :key="index" style="margin: 4px">{{ i }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark"/>
      <el-table-column label="状态">
        <template #default="scope">
          <span :class="{ 'c-danger': scope.row.statusId === 0 }">{{ statusIdEnums[scope.row.statusId] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sort"/>
      <el-table-column label="操作" width="240">
        <template #default="scope">
          <el-button v-if="checkPermission('system:admin:sys:user:edit')" plain type="warning" @click="handleAllocation(scope.row.id)">角色分配</el-button>
          <el-dropdown style="margin-left: 10px">
            <el-button>
              更多操作<i class="el-icon-arrow-down el-icon--right"/>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-button v-if="checkPermission('system:admin:sys:user:edit')" plain type="primary" @click="handleUpdateRow(scope.row.id)">编辑</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button v-if="checkPermission('system:admin:sys:user:password')" plain type="warning" @click="handleUpdatePassword(scope.row.id)">密码</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button v-if="scope.row.statusId === 0 && checkPermission('system:admin:sys:user:edit')" plain type="success" @click="handleUpdateStatus(scope.row)">启用</el-button>
                  <el-button v-if="scope.row.statusId === 1 && checkPermission('system:admin:sys:user:edit')" plain type="danger" @click="handleUpdateStatus(scope.row)">禁用</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button v-if="checkPermission('system:admin:sys:user:delete')" plain type="danger" @click="handleDeleteRow(scope.row)">删除</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page.pageCurrent" :page-size="page.pageSize" :page-sizes="[20, 50, 100, 200]" :total="page.totalCount" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    <add-sys-user v-if="addCtr.visible" :title="addCtr.title" :visible="addCtr.visible" @closes="closeAdd"/>
    <edit-sys-user v-if="editCtr.visible" :info="editCtr.info" :title="editCtr.title" :visible="editCtr.visible" @closes="closeEdit"/>
    <reset-password-sys-user v-if="resetPasswordCtr.visible" :info="resetPasswordCtr.info" :title="resetPasswordCtr.title" :visible="resetPasswordCtr.visible" @closes="closeUpdatePassword"/>
    <allocation-sys-role v-if="allocationCtr.visible" :id="allocationCtr.id" :title="allocationCtr.title" :visible="allocationCtr.visible" @closes="closeAllocation"/>
  </div>
</template>

<script>
import {sysUserDelete, sysUserPage, sysUserStatusId, sysUserView} from '@/api/system';
import AddSysUser from '@/views/system/sysUser/add/index.vue';
import EditSysUser from '@/views/system/sysUser/edit/index.vue';
import ResetPasswordSysUser from '@/views/system/sysUser/reset/index.vue';
import AllocationSysRole from '@/views/system/sysUser/allocation/index.vue';

export default {
  name: 'SysUser',
  components: {
    AllocationSysRole,
    ResetPasswordSysUser,
    EditSysUser,
    AddSysUser
  },
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
        title: '新增用户',
        visible: false
      },
      editCtr: {
        title: '编辑用户',
        visible: false,
        info: {}
      },
      resetPasswordCtr: {
        title: '修改密码',
        visible: false,
        info: {}
      },
      allocationCtr: {
        title: '角色分配',
        visible: false,
        id: undefined
      }
    };
  },
  created() {
    this.listForPage();
  },
  mounted() {
    this.$store
      .dispatch('GetOpts', {enumName: 'StatusIdEnum', type: 'obj'})
      .then((res) => {
        this.statusIdEnums = res;
      });
  },
  methods: {
    handleDeleteRow(row) {
      {
        const body = '确定要删除？';
        this.$confirm(body, '删除确认', {
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        }).then(() => {
          this.loading.start();
          sysUserDelete(row.id).then((res) => {
            this.$message.success(res);
            this.listForPage();
          });
        });
      }
    },
    handleSizeChange(size) {
      this.page.pageSize = size;
      this.page.pageCurrent = 1;
      this.listForPage();
    },
    handleCurrentChange(current) {
      this.page.pageCurrent = current;
      this.listForPage();
    },
    handleReset() {
      this.map = {};
      this.page.pageCurrent = 1;
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
      sysUserView(id).then((res) => {
        this.editCtr.info = res;
        this.editCtr.visible = true;
      });
    },
    handleResetRow(row) {
      let body = '确定重置【' + row.mobile + '】登录错误次数吗？'
      this.$confirm(body, '重置确认', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        this.loading.start();
        // sysUserResetErrorCount({id: row.id}).then(
        //   (res) => {
        //     this.$message.success(res);
        //     this.listForPage();
        //   }
        // );
      });
    },
    closeEdit(val) {
      if (val) {
        this.page.pageCurrent = 1;
        this.listForPage();
      }
      this.editCtr.visible = false;
    },
    handleUpdateStatus(row) {
      {
        let body = '确定要禁用【' + row.mobile + '】？';
        let statusId = 0;
        if (row.statusId === 0) {
          body = '确定要启用【' + row.mobile + '】？';
          statusId = 1;
        }
        this.$confirm(body, '编辑确认', {
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        }).then(() => {
          this.loading.start();
          sysUserStatusId({id: row.id, statusId}).then(
            (res) => {
              this.$message.success(res);
              this.listForPage();
            }
          );
        });
      }
    },
    handleUpdatePassword(id) {
      this.resetPasswordCtr.info = {
        id: id
      };
      this.resetPasswordCtr.visible = true;
    },
    closeUpdatePassword(val) {
      if (val) {
        this.page.pageCurrent = 1;
        this.listForPage();
      }
      this.resetPasswordCtr.visible = false;
    },
    handleAllocation(id) {
      this.allocationCtr.id = id;
      this.allocationCtr.visible = true;
    },
    closeAllocation(val) {
      if (val) {
        this.page.pageCurrent = 1;
        this.listForPage();
      }
      this.allocationCtr.visible = false;
    },
    listForQuery() {
      this.page.pageCurrent = 1;
      this.listForPage();
    },
    listForPage() {
      this.loading.start();
      sysUserPage(this.map, this.page.pageCurrent, this.page.pageSize).then(
        (res) => {
          this.list = res.list;
          this.page.pageCurrent = res.pageCurrent;
          this.page.totalCount = res.totalCount;
          this.page.pageSize = res.pageSize;
        }
      );
    }
  }
};
</script>
