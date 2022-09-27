<template>
  <div class="app-container">
    <el-form class="filter-container" inline label-width="80px">
      <el-form-item>
        <el-button plain @click="listMenuPermission">刷新</el-button>
        <el-button v-if="checkPermission('system:admin:sys:menu:save')" plain type="success" @click="handleAddOneMenu">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table ref="tableDom" :data="list" :load="loadTree" :tree-props="{ children: 'childrenList', hasChildren: 'hasChildren' }" border element-loading-text="Loading" fit highlight-current-row lazy row-key="id">
      <el-table-column label="名称" min-width="250" prop="menuName">
        <template #default="scope">
          <svg-icon :icon-class="scope.row.menuIcon || ''"/>&nbsp;{{ scope.row.menuName }}
        </template>
      </el-table-column>
      <el-table-column label="类型">
        <template #default="scope">
          {{ menuTypeEnums[scope.row.menuType] }}
        </template>
      </el-table-column>
      <el-table-column label="路由地址 / 权限标识" min-width="250" prop="menuUrl">
        <template #default="scope">
          {{ scope.row.menuUrl }}
          <div v-html="scope.row.authValue" style="white-space:pre-line"></div>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="statusId">
        <template #default="scope">
          <span :class="{ red: scope.row.statusId === 0 }">{{ statusIdEnums[scope.row.statusId] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sort"/>
      <el-table-column label="操作" width="320">
        <template #default="scope">
          <el-button v-if="checkPermission('system:admin:sys:menu:save') && scope.row.menuType === 1 || checkPermission('system:admin:sys:menu:save') && scope.row.menuType === 2" plain type="success" @click="handleAddSubMenu(scope.row)">新增</el-button>
          <el-button v-if="checkPermission('system:admin:sys:menu:edit')" plain type="primary" @click="handleEditRow(scope.row)">编辑</el-button>
          <el-button v-if="checkPermission('system:admin:sys:menu:edit') && scope.row.statusId === 1" plain type="danger" @click="handleUpdateStatus(scope.row)">禁用</el-button>
          <el-button v-if="checkPermission('system:admin:sys:menu:edit') && scope.row.statusId === 0" plain type="success" @click="handleUpdateStatus(scope.row)">启用</el-button>
          <el-button v-if="checkPermission('system:admin:sys:menu:delete')" plain type="danger" @click="handleDeleteRow(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <add-sys-menu
      v-if="addMenuCtr.visible"
      :info="addMenuCtr.info"
      :title="addMenuCtr.title"
      :visible="addMenuCtr.visible"
      @closes="closeAddMenu"
    />
    <add-sys-permission
      v-if="addPermissionCtr.visible"
      :info="addPermissionCtr.info"
      :title="addPermissionCtr.title"
      :visible="addPermissionCtr.visible"
      @closes="closeAddPermission"
    />
    <edit-sys-menu
      v-if="editMenuCtr.visible"
      :info="editMenuCtr.info"
      :title="editMenuCtr.title"
      :visible="editMenuCtr.visible"
      @closes="closeEditMenu"
    />
    <edit-sys-permission
      v-if="editPermissionCtr.visible"
      :info="editPermissionCtr.info"
      :title="editPermissionCtr.title"
      :visible="editPermissionCtr.visible"
      @closes="closeEditPermission"
    />
  </div>
</template>

<script>
import {sysMenuDelete, sysMenuEdit, sysMenuList, sysMenuView} from '@/api/system';
import AddSysMenu from '@/views/system/sysMenu/add/index.vue';
import AddSysPermission from '@/views/system/sysMenu/permission/add.vue';
import EditSysMenu from '@/views/system/sysMenu/edit/index.vue';
import EditSysPermission from '@/views/system/sysMenu/permission/edit.vue';

export default {
  name: 'SysMenu',
  components: {EditSysMenu, AddSysMenu, AddSysPermission, EditSysPermission},
  data() {
    return {
      list: [],
      listLoading: true,
      menuTypeEnums: {},
      loadNodeMap: new Map(),
      statusIdEnums: {},
      addMenuCtr: {
        title: '新增菜单',
        visible: false,
        info: {}
      },
      editMenuCtr: {
        title: '编辑菜单',
        visible: false,
        info: {}
      },
      addPermissionCtr: {
        title: '新增权限',
        visible: false,
        info: {}
      },
      editPermissionCtr: {
        title: '编辑权限',
        visible: false,
        info: {}
      }
    };
  },
  created() {
    this.listMenuPermission();
  },
  mounted() {
    this.$store
      .dispatch('GetOpts', {enumName: 'MenuTypeEnum', type: 'obj'})
      .then((res) => {
        this.menuTypeEnums = res;
      });
    this.$store
      .dispatch('GetOpts', {enumName: 'StatusIdEnum', type: 'obj'})
      .then((res) => {
        this.statusIdEnums = res;
      });
  },
  methods: {
    handleEditRow(row) {
      if (row.menuType === 3) {
        this.handleEditPermission(row);
      } else {
        this.handleEditMenu(row);
      }
    },
    handleEditPermission(row) {
      sysMenuView(row.id).then((res) => {
        this.editPermissionCtr.info = res;
        this.editPermissionCtr.visible = true;
      });
    },
    loadTree(tree, treeNode, resolve) {
      sysMenuList(tree.id)
        .then((res) => {
          this.loadNodeMap.set(tree.id, {tree, treeNode, resolve});
          resolve(res);
        })
        .catch(() => {
          resolve([]);
        });
    },
    handleEditMenu(row) {
      sysMenuView(row.id).then((res) => {
        this.editMenuCtr.info = res;
        this.editMenuCtr.visible = true;
      });
    },
    closeEditMenu(data) {
      this.editMenuCtr.visible = false;
      if (data) {
        this.loadTreePage(data.parentId || data.menuId);
      }
    },
    closeEditPermission(data) {
      this.editPermissionCtr.visible = false;
      if (data) {
        this.loadTreePage(data.parentId || data.menuId);
      }
    },
    handleDeleteRow(row) {
      if (row.menuType === 3) {
        this.handleDeletePermission(row);
      } else {
        this.handleDeleteMenu(row);
      }
    },
    handleDeleteMenu(row) {
      let body = '确定要删除菜单【' + row.menuName + '】？';
      if (row.menuType === 1) {
        body = '确定要删除目录【' + row.menuName + '】？';
      }
      this.$confirm(body, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading.start();
          sysMenuDelete(row.id).then((res) => {
            this.$message.success(res);
            this.loadTreePage(row.parentId || row.menuId);
          });
        })
        .catch(() => {

        });
    },
    handleDeletePermission(row) {
      const body = '确定要删除权限【' + row.menuName + '】？';
      this.$confirm(body, '删除确认', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.loading.start();
          sysMenuDelete(row.id).then((res) => {
            this.$message.success(res);
            this.loadTreePage(row.parentId || row.menuId);
          });
        })
        .catch(() => {

        });
    },
    handleAddOneMenu() {
      this.addMenuCtr.info = {
        parentId: 0
      };
      this.addMenuCtr.visible = true;
    },
    handleAddSubMenu(row) {
      if (row.menuType === 2) {
        this.addPermissionCtr.info = {
          menuId: row.id,
          menuName: row.menuName
        };
        this.addPermissionCtr.visible = true;
      } else {
        this.addMenuCtr.info = {
          parentId: row.id,
          parentName: row.menuName
        };
        this.addMenuCtr.visible = true;
      }
    },
    handleUpdateStatus(row) {
      if (row.menuType === 3) {
        this.handleUpdatePermissionStatus(row);
      } else {
        this.handleUpdateMenuStatus(row);
      }
    },
    handleUpdateMenuStatus(row) {
      let body =
        '确定禁用' + this.menuTypeEnums[row.menuType] + '【' + row.menuName + '】？';
      let statusId = 0;
      if (row.statusId === 0) {
        statusId = 1;
        body =
          '确定启用' + this.menuTypeEnums[row.menuType] + '【' + row.menuName + '】？';
      }
      this.$confirm(body, '编辑确认', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.loading.start();
          sysMenuEdit({id: row.id, statusId}).then((res) => {
            this.$message.success(res);
            this.loadTreePage(row.parentId || row.menuId);
          });
        })
        .catch(() => {

        });
    },
    handleUpdatePermissionStatus(row) {
      let body = '确定禁用权限【' + row.menuName + '】？';
      let statusId = 0;
      if (row.statusId === 0) {
        statusId = 1;
        body = '确定启用权限【' + row.menuName + '】？';
      }
      this.$confirm(body, '编辑确认', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.loading.start();
          sysMenuEdit({id: row.id, statusId}).then((res) => {
            this.$message.success(res);
            this.loadTreePage(row.parentId || row.menuId);
          });
        })
        .catch(() => {
        });
    },
    closeAddMenu(data) {
      this.addMenuCtr.visible = false;
      if (data) {
        this.loadTreePage(data.parentId || data.menuId);
      }
    },
    closeAddPermission(data) {
      this.addPermissionCtr.visible = false;
      if (data) {
        this.loadTreePage(data.parentId || data.menuId);
      }
    },
    loadTreePage(id) {
      this.listMenuPermission();
    },
    listMenuPermission() {
      sysMenuList().then((res) => {
        this.list = res;
      });
    }
  }
};
</script>
