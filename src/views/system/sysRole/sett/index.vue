<template>
  <el-dialog
    v-model="visible"
    :before-close="handleClose"
    :title="title"
    center
    width="400px"
  >
    <div style="min-height: 10vh">
      <el-tree
        ref="tree"
        :data="availableList"
        :props="defaultProps"
        accordion
        highlight-current
        node-key="id"
        show-checkbox
      />
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import {sysMenuList, sysRoleAllocationMenuAndPermission, sysRoleListSelectMenuAndPermission} from '@/api/system';

export default {
  name: 'SysRoleSett',
  props: {
    title: {
      type: String,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      form: {},
      availableList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  emits: ['closes'],
  mounted() {
    this.form.roleId = this.info.id;
    // 获取可用菜单
    sysMenuList().then(res => {
      for (const index in res) {
        const info = res[index];
        const treeInfo = {};
        // if (info.type === 2) {
        //     treeInfo.id = 'PMS_' + info.id;
        // } else {
        //     treeInfo.id = 'MENU_' + info.id;
        // }
        treeInfo.id = info.id;

        treeInfo.label = info.menuName;
        info.childrenList = info.childrenList || [];
        if (info.childrenList.length > 0) {
          treeInfo.children = this.recursiveTreeInfo(info.id, info.childrenList);
        }

        this.availableList.push(treeInfo);
      }

      // 设置选中
      this.settCheckMenu();
    })
  },
  methods: {
    settCheckMenu() {
      // 获取已选择菜单和权限
      sysRoleListSelectMenuAndPermission(this.info.id).then(res => {
        // const checkedKeyList = [];
        // for (const index in res) {
        //     checkedKeyList.push('MENU_' + res[index]);
        // }
        // for (const index in res.permissionList) {
        //     checkedKeyList.push('PMS_' + res.permissionList[index]);
        // }
        const checkedKeyList = res
        // 设置选中
        checkedKeyList.forEach(item => {
          const node = this.$refs.tree.getNode(item);
          if (node != null && node.isLeaf) {
            this.$refs.tree.setChecked(node, true);
          }
        })
      })
    },
    handleClose() {
      this.availableList = [];
      this.checkedKeyList = [];
      this.$emit('closes');
    },
    recursiveTreeInfo(parentId, infoList) {
      const resultList = [];
      for (const index in infoList) {
        const info = infoList[index];
        if (info.parentId !== parentId) {
          continue;
        }

        const treeInfo = {};
        // if (info.type === 2) {
        //     treeInfo.id = 'PMS_' + info.id;
        // } else {
        //     treeInfo.id = 'MENU_' + info.id;
        // }
        treeInfo.id = info.id;
        treeInfo.label = info.menuName;

        if (info.childrenList != null && info.childrenList.length > 0) {
          treeInfo.children = this.recursiveTreeInfo(info.id, info.childrenList);
        }
        resultList.push(treeInfo);
      }
      return resultList;
    },
    submitForm() {
      const menuIdList = [];
      // const permissionIdList = [];
      const checkedNodes = this.$refs.tree.getCheckedNodes()
      console.log(checkedNodes);
      for (const index in checkedNodes) {
        const info = checkedNodes[index];
        menuIdList.push(info.id)
        // if (info.id.indexOf('PMS_') === 0) {
        //     permissionIdList.push(info.id.substr(4))
        // } else if (info.id.indexOf('MENU_') === 0) {
        //     menuIdList.push(info.id.substr(5))
        // }
      }
      // const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
      // for (const index in halfCheckedKeys) {
      //     const idInfo = halfCheckedKeys[index];
      //     if (idInfo.indexOf('PMS_') === 0) {
      //         permissionIdList.push(idInfo.substr(4))
      //     } else if (idInfo.indexOf('MENU_') === 0) {
      //         menuIdList.push(idInfo.substr(5))
      //     }
      // }

      this.form = {
        roleId: this.info.id,
        menuIdList: menuIdList
        // permissionIdList: permissionIdList
      }

      this.onSubmit()
    },
    onSubmit() {
      // 新增
      sysRoleAllocationMenuAndPermission(this.form).then(res => {
        this.$message.success(res, 'success');
        // setTimeout(() => {
        //   window.location.reload()
        // }, 1000)
        this.$emit('closes', 'success');
      })
    }
  }
}
</script>

<style scoped>

</style>
