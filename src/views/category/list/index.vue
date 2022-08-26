<template>
  <div class="app-container">
    <el-form class="filter-container" inline label-width="100px" size="mini">
      <el-form-item class="filter-item" label="名称">
        <el-input v-model="map.categoryName" clearable />
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" @click="listForPage">查询</el-button>
        <el-button class="filter-item" @click="handleReset">重置</el-button>
        <el-button plain size="mini" type="success" @click="handleAddOneRow">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="list"
      :default-expand-all="true"
      :tree-props="{children: 'childrenList', hasChildren: 'hasChildren'}"
      border
      element-loading-text="Loading"
      fit
      highlight-current-row
      row-key="id"
      size="mini"
    >
      <el-table-column label="名称" prop="categoryName" />
      <el-table-column label="状态">
        <template v-slot="scope">
          {{ statusEnums[scope.row.status] }}
        </template>
      </el-table-column>
      <el-table-column label="排序" min-width="80" prop="sort" />
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button plain size="mini" type="primary" @click="handleUpdateRow(scope.row.id)">编辑</el-button>
          <el-button v-if="scope.row.status === 1" plain size="mini" type="danger" @click="handleUpdateStatus(scope.row)">禁用</el-button>
          <el-button v-if="scope.row.parentId == 0 || scope.row.childrenList.length >0" plain size="mini" type="success" @click="handleAddRow(scope.row)">添加</el-button>
          <el-button v-if="scope.row.status === 0" plain size="mini" type="success" @click="handleUpdateStatus(scope.row)">启用</el-button>
          <el-button v-if="scope.row.childrenList.length <=0" plain size="mini" type="danger" @click="handleDeleteRow(scope.row)">删除</el-button>
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
    <add :info="addCtr.info" :title="addCtr.title" :visible="addCtr.visible" @close-callback="closeCallback" />
    <edit :info="editCtr.info" :title="editCtr.title" :visible="editCtr.visible" @close-callback="closeEditCallback" />
  </div>
</template>

<script>
import {categoryDelete, categoryPage, categoryStatus, categoryView} from '@/api/course'
import Add from '../add';
import Edit from '../edit';

export default {
  name: 'Category',
  components: {Add, Edit},
  data() {
    return {
      page: {
        list: [],
        pageCurrent: 1,
        pageSize: 20,
        totalCount: 0
      },
      list: [],
      formData: {},
      map: {},
      statusEnums: {},
      listLoading: true,
      addCtr: {
        title: '添加文章',
        visible: false,
        info: {}
      },
      editCtr: {
        title: '编辑文章',
        visible: false,
        info: {}
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
    handleDeleteRow(row) {
      {
        const body = '确定要删除【' + row.categoryName + '】？'
        this.$confirm(body, '删除确认', {
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        }).then(() => {
          this.loading.start();
          categoryDelete(row.id).then(res => {
            this.$message.success(res.data);
            this.listForPage();
          })
        })
      }
    },
    handleAddRow(row) {
      this.addCtr.info = {
        parentId: row.id,
        sort: 1
      }
      this.addCtr.visible = true;
    },
    handleAddOneRow() {
      this.addCtr.info = {
        parentId: 0,
        sort: 1
      }
      this.addCtr.visible = true;
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
    handleUpdateRow(id) {
      categoryView(id).then(res => {
        this.editCtr.info = res.data;
        this.editCtr.visible = true;
      })
    },
    handleUpdateStatus(row) {
      {
        let body = '确定要禁用【' + row.categoryName + '】？';
        if (row.status === 0) {
          body = '确定要启用【' + row.categoryName + '】？'
        }
        this.$confirm(body, '设置状态', {
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        }).then(() => {
          this.loading.start();
          categoryStatus(row.id).then(res => {
            this.$message.success(res.data);
            this.listForPage();
          })
        })
      }
    },
    listForPage() {
      this.loading.start()
      categoryPage(this.map, this.page.pageCurrent, this.page.pageSize).then(res => {
        this.list = res.data.records
        this.page.pageCurrent = res.data.current * 1
        this.page.totalCount = res.data.total * 1
        this.page.pageSize = res.data.size * 1
      })
    },
    // 关闭编辑弹窗回调
    closeCallback() {
      this.addCtr.visible = false;
      this.reload();
    },
    closeEditCallback() {
      this.editCtr.visible = false;
      this.reload();
    },
    // 刷新页面
    reload() {
      this.map = {};
      this.formData = {};
      this.listForPage();
    }
  }
}
</script>
