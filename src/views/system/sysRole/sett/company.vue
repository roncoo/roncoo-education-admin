<template>
  <el-dialog :model-value="visible" :before-close="handleClose" :title="title" center width="400px">
    <div v-loading="ctrl.loading" style="min-height: 10vh">
      <el-tree ref="tree" :data="availableList" :props="defaultProps" accordion highlight-current node-key="id" show-checkbox/>
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
import {sysMenuInfoAvailableList, sysRoleMenuBatchSet, sysRoleMenuList, sysRoleSetAllocationMenuAndPermission, sysshopMenuDistributableList, sysshopMenuIdList} from '@/api/system';
import {useStore} from 'vuex';
import {onMounted, reactive, ref, toRefs} from 'vue';
import {ElMessage} from 'element-plus';
import {useRoute} from 'vue-router';

export default {
  name: 'SysRoleSettCompany',
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
  setup(props, ctx) {
    const {title, visible, info} = toRefs(props);
    const {query} = useRoute();
    const store = useStore();
    let form = reactive({});
    const ctrl = reactive({
      loading: false
    })
    let availableList = reactive([]);
    let checkedKeyList = reactive([]);
    const defaultProps = reactive({
      children: 'children',
      label: 'label'
    });
    onMounted(() => {
      //console.log(info.value["defaultId"], "defaultId");
      form.id = info.value['id'];
      // 获取可用菜单
      ctrl.loading = true
      if (info.value['defaultId']) {
        sysshopMenuDistributableList(query.sid).then((res) => {
          for (const index in res) {
            const info = res[index];
            const treeInfo = {};
            treeInfo.label = info.menuName;
            treeInfo.id = info.id;
            info.childrenList = info.childrenList || [];
            if (info.childrenList.length > 0) {
              treeInfo.children = recursiveTreeInfo(info.id, info.childrenList);
            }

            availableList.push(treeInfo);
          }

          // 设置选中
          settCheckMenu();
          ctrl.loading = false
        }).catch(() => {
          ctrl.loading = false
        });
      } else {
        sysMenuInfoAvailableList().then((res) => {
          for (const index in res) {
            const info = res[index];
            const treeInfo = {};
            treeInfo.label = info.menuName;
            treeInfo.id = info.id;
            info.childrenList = info.childrenList || [];
            if (info.childrenList.length > 0) {
              treeInfo.children = recursiveTreeInfo(info.id, info.childrenList);
            }

            availableList.push(treeInfo);
          }

          // 设置选中
          settCheckMenu();
          ctrl.loading = false
        }).catch(() => {
          ctrl.loading = false
        });
      }
    });

    function settCheckMenu() {
      // 获取已选择菜单和权限
      if (info.value['defaultId']) {
        sysRoleMenuList(info.value['id']).then((res) => {
          // 设置选中
          tree['value'].setCheckedKeys(res);
        });
      } else {
        // sysshopMenuIdList(info.value['id']).then(res => {
        //     console.log(res);
        //     // 设置选中
        //     tree['value'].setCheckedKeys(res);
        // })
        sysshopMenuIdList(info.value['id']).then((res) => {
          const checkedKeyList = res;
          // 设置选中
          checkedKeyList.forEach((item) => {
            const node = tree['value'].getNode(item);
            if (node != null && node.isLeaf) {
              tree['value'].setChecked(node, true);
            }
          });
        });
      }
    }

    const tree = ref(null);

    function handleClose() {
      availableList = reactive([]);
      checkedKeyList = [];
      ctx.emit('closes');
    }

    function recursiveTreeInfo(parentId, infoList) {
      const resultList = [];
      for (const index in infoList) {
        const info = infoList[index];
        if (info.parentId !== parentId) {
          continue;
        }

        const treeInfo = {};
        treeInfo.label = info.menuName;
        treeInfo.id = info.id;

        if (info.childrenList != null && info.childrenList.length > 0) {
          treeInfo.children = recursiveTreeInfo(info.id, info.childrenList);
        }
        resultList.push(treeInfo);
      }
      return resultList;
    }

    function submitForm() {
      const checkedNodes = tree['value'].getCheckedKeys().concat(tree['value'].getHalfCheckedKeys());
      if (!info.value['defaultId']) {
        form = {
          sid: info.value['id'],
          id: info.value['id'],
          menuIdList: checkedNodes
        };
      } else {
        form = {
          roleId: info.value['id'],
          menuIdList: checkedNodes
        };
      }

      onSubmit();
    }

    function onSubmit() {
      // 新增
      if (!info.value['defaultId']) {
        const {menuIdList, sid} = form;
        sysRoleSetAllocationMenuAndPermission({menuIdList, sid}).then((res) => {
          ElMessage.success(res, 'success');
          // setTimeout(() => {
          //   window.location.reload()
          // }, 1000)
          ctx.emit('closes', 'success');
        });
      } else {
        sysRoleMenuBatchSet(form).then((res) => {
          ElMessage.success(res, 'success');
          // setTimeout(() => {
          //   window.location.reload()
          // }, 1000)
          ctx.emit('closes', 'success');
        });
      }
    }

    return {
      ctrl,
      title,
      visible,
      info,
      availableList,
      checkedKeyList,
      defaultProps,
      tree,
      form,
      handleClose,
      submitForm
    };
  },
  emits: ['closes']
};
</script>

<style scoped></style>
