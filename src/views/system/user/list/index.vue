<template>
  <div class="app-container">
    <el-form class="filter-container" inline label-width="100px" size="mini">
      <el-form-item class="filter-item" label="登录账号">
        <el-input v-model="params.loginNo" clearable />
      </el-form-item>
      <el-form-item class="filter-item" label="状态">
        <el-select v-model="params.status" clearable placeholder="请选择">
          <el-option
            v-for="(value, key) in statusEnums"
            :key="key"
            :label="value"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="listForPage">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
        <el-button plain size="mini" type="success" @click="handleAddRow">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="page.list"
      border
      element-loading-text="Loading"
      fit
      highlight-current-row
      size="mini"
    >
      <el-table-column align="center" label="序号" type="index" width="50" />
      <el-table-column label="登录账号" prop="loginNo" />
      <el-table-column label="昵称" prop="nickname" />
      <el-table-column label="备注" prop="remark" />
      <el-table-column label="状态">
        <template v-slot="scope">
          {{ statusEnums[scope.row.status] }}
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sort" />
      <el-table-column label="操作" width="300">
        <template v-slot="scope">
          <el-button plain size="mini" type="primary" @click="handleUpdateRow(scope.row.id)">编辑</el-button>
          <el-button plain size="mini" type="primary" @click="handlePasswordRow(scope.row.id)">密码</el-button>
          <el-button
            v-if="scope.row.status === 0"
            plain
            size="mini"
            type="success"
            @click="handleUpdateStatus(scope.row)"
          >启用
          </el-button>
          <el-button
            v-if="scope.row.status === 1"
            plain
            size="mini"
            type="danger"
            @click="handleUpdateStatus(scope.row)"
          >禁用
          </el-button>
          <el-button
            v-if="scope.row.allowDelete === 1"
            plain
            size="mini"
            type="danger"
            @click="handleDel(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="page.pageCurrent"
      :page-size="page.pageSize"
      :page-sizes="[20, 50, 100, 200]"
      :total="page.totalCount"
      background
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <users-add v-if="addCtr.visible" :visible="addCtr.visible" @close="handleAddClose" />
    <users-edit v-if="editCtr.visible" :info="editCtr.info" :visible="editCtr.visible" @close="handleUpdateClose" />
    <users-password v-if="passwordCtr.visible" :id="passwordCtr.id" :visible="passwordCtr.visible" @close="handlePasswordClose" />
  </div>
</template>

<script>
import {usersDelete, usersPage, usersStatus, usersView} from '@/api/user';
import UsersEdit from '@/views/users/edit';
import UsersAdd from '@/views/users/add';
import UsersPassword from '../password';

export default {
  name: 'Users',
  components: {UsersEdit, UsersAdd, UsersPassword},
  data() {
    return {
      params: {},
      page: {
        list: [],
        pageCurrent: 1,
        pageSize: 20,
        totalCount: 0
      },
      statusEnums: {},
      passwordCtr: {
        info: {},
        visible: false
      },
      editCtr: {
        info: {},
        visible: false
      },
      addCtr: {
        info: {},
        visible: false
      }
    }
  },
  created() {
    this.listForPage()
  },
  mounted() {
    this.$store.dispatch('GetOpts', {enumName: 'StatusEnum', type: 'obj'}).then(res => {
      this.statusEnums = res;
    });
  },
  methods: {
    handleAddRow() {
      this.addCtr.visible = true;
    },
    handleAddClose() {
      this.addCtr.visible = false;
      this.page.pageCurrent = 1;
      this.listForPage();
    },
    handleUpdateRow(id) {
      usersView(id).then(res => {
        this.editCtr.info = res.data;
        this.editCtr.visible = true;
      })
    },
    handleUpdateClose() {
      this.editCtr.visible = false;
      this.page.pageCurrent = 1;
      this.listForPage();
    },
    handlePasswordRow(id) {
      this.passwordCtr.id = id;
      this.passwordCtr.visible = true;
    },
    handlePasswordClose() {
      this.passwordCtr.visible = false;
      this.page.pageCurrent = 1;
      this.listForPage();
    },
    handleUpdateStatus(row) {
      {
        let body = '确定要禁用【' + row.nickname + '】？';
        if (row.status === 0) {
          body = '确定要启用【' + row.nickname + '】？'
        }
        this.$confirm(body, '设置状态', {
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        }).then(() => {
          this.loading.start();
          usersStatus(row.id).then(res => {
            this.$message.success(res.data);
            this.listForPage();
          })
        })
      }
    },
    handleDel(row) {
      this.$confirm('确实要删除该账号【' + row.nickname + '】？请注意删除无法恢复', '删除账号', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        usersDelete(row.id).then(res => {
          this.listForPage();
        })
      })
    },
    handleReset() {
      this.params = {}
      this.page.pageCurrent = 1
      this.listForPage();
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
    listForPage() {
      this.loading.start()
      usersPage(this.params, this.page.pageCurrent, this.page.pageSize).then(res => {
        this.page.list = res.data.records
        this.page.pageCurrent = res.data.current * 1
        this.page.totalCount = res.data.total * 1
        this.page.pageSize = res.data.size * 1
      })
    }
  }
}
</script>
