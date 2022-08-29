<template>
  <div class="app-container">
    <el-form class="filter-container" inline label-width="100px">
      <el-form-item>
        <el-button
          v-if="checkPermission('base:boss:sys:menu:save')"
          plain
          type="success"

          @click="handleAddOneMenu"
        >新增
        </el-button>
        <el-button v-if="checkPermission('base:boss:sys:menu:view')" plain type="success"
                   @click="listMenuPermission"
        >刷新
        </el-button>
        <!--                <span class="c-brand">&nbsp;<i class="el-icon-info"/>新增、编辑权限需手动刷新页面</span>-->
      </el-form-item>
    </el-form>
    <el-table
      ref="tableDom"
      :data="list"

      :load="loadTree"
      :tree-props="{ children: 'childrenList', hasChildren: 'hasChildren' }"
      border
      element-loading-text="Loading"
      fit
      highlight-current-row
      lazy
      row-key="id"
    >
      <el-table-column label="名称" min-width="250" prop="menuName">
        <template #default="scope">
          <svg-icon :icon-class="scope.row.icon || ''"/>&nbsp;{{ scope.row.menuName }} - {{ scope.row.menuNameEn }}
        </template>
      </el-table-column>
      <el-table-column label="类型">
        <template #default="scope">
          {{ menuTypeEnums[scope.row.menuType] }}
        </template>
      </el-table-column>
      <el-table-column label="路由地址 / 权限标识" min-width="250" prop="routerUrl"/>
      <!-- <el-table-column label="权限标识" prop="value" /> -->
      <el-table-column label="状态" prop="status">
        <template #default="scope">
          <span :class="{ red: scope.row.status === 0 }">{{
              statusEnums[scope.row.status]
            }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sort"/>
      <el-table-column label="操作" width="320">
        <template #default="scope">
          <el-button
            v-if="scope.row.menuType === 1 || scope.row.menuType === 2"
            plain
            type="success"

            @click="handleAddSubMenu(scope.row)"
          >新增
          </el-button>
          <el-button
            v-if="checkPermission('base:boss:sys:menu:edit')"
            plain
            type="primary"

            @click="handleEditRow(scope.row)"
          >编辑
          </el-button
          >
          <el-button
            v-if="scope.row.status === 1 && checkPermission('base:boss:sys:menu:update:status')"
            plain
            type="danger"

            @click="handleUpdateStatus(scope.row)"
          >禁用
          </el-button
          >
          <el-button
            v-if="scope.row.status === 0 && checkPermission('base:boss:sys:menu:update:status')"
            plain
            type="success"

            @click="handleUpdateStatus(scope.row)"
          >启用
          </el-button
          >
          <el-button
            v-if="checkPermission('base:boss:sys:menu:delete')"
            plain
            type="danger"

            @click="handleDeleteRow(scope.row)"
          >删除
          </el-button
          >
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
import {sysMenuDelete, sysMenuPermission, sysMenuUpdateStatus, sysMenuView, sysPermissionDelete, sysPermissionUpdateStatus, sysPermissionView} from "@/api/system";
import AddSysMenu from "@/views/system/sysMenu/add/index.vue";
import AddSysPermission from "@/views/system/sysMenu/permission/add.vue";
import EditSysMenu from "@/views/system/sysMenu/edit/index.vue";
import EditSysPermission from "@/views/system/sysMenu/permission/edit.vue";

export default {
  name: 'SysMenu',
  components: {EditSysMenu, AddSysMenu, AddSysPermission, EditSysPermission},
  data() {
    return {
      list: [],
      listLoading: true,
      menuTypeEnums: {},
      loadNodeMap: new Map(),
      statusEnums: {},
      addMenuCtr: {
        title: "新增菜单",
        visible: false,
        info: {},
      },
      editMenuCtr: {
        title: "编辑菜单",
        visible: false,
        info: {},
      },
      addPermissionCtr: {
        title: "新增权限",
        visible: false,
        info: {},
      },
      editPermissionCtr: {
        title: "编辑权限",
        visible: false,
        info: {},
      },
    };
  },
  created() {
    this.listMenuPermission();
  },
  mounted() {
    this.$store
      .dispatch("GetOpts", {enumName: "MenuTypeEnum", type: "obj"})
      .then((res) => {
        this.menuTypeEnums = res;
      });
    this.$store
      .dispatch("GetOpts", {enumName: "StatusEnum", type: "obj"})
      .then((res) => {
        this.statusEnums = res;
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
      sysPermissionView(row.id).then((res) => {
        this.editPermissionCtr.info = res;
        this.editPermissionCtr.visible = true;
      });
    },
    loadTree(tree, treeNode, resolve) {
      sysMenuPermission(tree.id)
        .then((res) => {
          this.loadNodeMap.set(tree.id, {tree, treeNode, resolve});
          resolve(res);
        })
        .catch(() => {
          resolve([]);
        });
    },
    handleEditMenu(row) {
      console.log("row", row.id);
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
      let body = "确定要删除菜单【" + row.menuName + "】？";
      if (row.menuType === 1) {
        body = "确定要删除目录【" + row.menuName + "】？";
      }
      this.$confirm(body, "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
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
    //todo
    handleDeletePermission(row) {
      const body = "确定要删除权限【" + row.menuName + "】？";
      this.$confirm(body, "删除确认", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      })
        .then(() => {
          this.loading.start();
          sysPermissionDelete(row.id).then((res) => {
            this.$message.success(res);
            this.loadTreePage(row.parentId || row.menuId);
          });
        })
        .catch(() => {

        });
    },
    handleAddOneMenu() {
      this.addMenuCtr.info = {
        parentId: 0,
      };
      this.addMenuCtr.visible = true;
    },
    handleAddSubMenu(row) {
      if (row.menuType === 2) {
        this.addPermissionCtr.info = {
          menuId: row.id,
          menuName: row.menuName,
        };
        this.addPermissionCtr.visible = true;
      } else {
        this.addMenuCtr.info = {
          parentId: row.id,
          parentName: row.menuName,
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
        "确定禁用" + this.menuTypeEnums[row.menuType] + "【" + row.menuName + "】？";
      let status = 0;
      if (row.status === 0) {
        status = 1;
        body =
          "确定启用" + this.menuTypeEnums[row.menuType] + "【" + row.menuName + "】？";
      }
      this.$confirm(body, "编辑确认", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      })
        .then(() => {
          this.loading.start();
          sysMenuUpdateStatus({id: row.id, status}).then((res) => {
            this.$message.success(res);
            this.loadTreePage(row.parentId || row.menuId);
          });
        })
        .catch(() => {

        });
    },

    //todo
    handleUpdatePermissionStatus(row) {
      let body = "确定禁用权限【" + row.menuName + "】？";
      let status = 0;
      if (row.status === 0) {
        status = 1;
        body = "确定启用权限【" + row.menuName + "】？";
      }
      this.$confirm(body, "编辑确认", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      })
        .then(() => {
          this.loading.start();
          sysPermissionUpdateStatus(row.id, status).then((res) => {
            this.$message.success(res);
            this.loadTreePage(row.parentId || row.menuId);
          });
        })
        .catch(() => {

        });
    },
    closeAddMenu(data) {
      this.addMenuCtr.visible = false;
      console.log("data", data);
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
      // if (+id === 0) {
      this.listMenuPermission();
      // } else {
      //     const {tree, treeNode, resolve} = this.loadNodeMap.get(id);
      //     if (tree) {
      //         console.log(tree);
      //         // this.$set(this.$refs.tableDom.store.states.lazyTreeNodeMap, id, []);
      //         this.loadTree(tree, treeNode, resolve);
      //     } else {
      //         this.listMenuPermission();
      //     }
      // }
    },
    listMenuPermission() {
      // this.list = [];
      sysMenuPermission().then((res) => {
        this.list = res;
      });
    },
  },
};
</script>
