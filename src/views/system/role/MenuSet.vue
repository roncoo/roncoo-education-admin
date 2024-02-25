<template>
  <el-dialog :append-to-body="true" :model-value="visible" title="菜单设置" width="600px" center @close="onClose" :destroy-on-close="true">
    <div style="min-height: 10vh">
      <el-tree ref="treeRef" :data="treeList" :props="defaultProps" node-key="id" accordion highlight-current show-checkbox @check-change="checkChange" />
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onClose()">取 消</el-button>
        <el-button type="primary" @click="onSubmit()">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
  import { systemApi } from '@/api/system'
  import { ref } from 'vue'

  const treeRef = ref()
  const treeList = ref([])

  // 提交
  const emit = defineEmits(['refresh'])
  const onSubmit = async () => {
    const menus = treeRef.value.getCheckedNodes().concat(treeRef.value.getHalfCheckedNodes())
    if (menus.length > 0) {
      menuIds.value = []
      menus.forEach((item) => {
        menuIds.value.push(item.id)
      })
    }
    console.log(menuIds.value)
    await systemApi.sysMenuRoleSave({ roleId: roleId.value, menuIdList: menuIds.value })
    emit('refresh')
    onClose()
  }

  // 子节点全部取消，父节点也可以半选中
  const checkChange = (a, b, c) => {
    const anode = treeRef.value.getNode(a)
    if (!anode.checked) {
      const fnode = treeRef.value.getNode(anode.parent)
      if (!fnode.isLeaf) {
        fnode.indeterminate = true
      }
    }
  }

  // 打开和关闭
  const roleId = ref() // 角色ID
  const menuIds = ref([]) // 用户菜单集合
  const visible = ref(false) // 弹窗显示状态
  const onOpen = async (item) => {
    roleId.value = item.id
    treeList.value = await systemApi.sysMenuList()
    systemApi.sysMenuRoleList({ roleId: roleId.value }).then((res) => {
      menuIds.value = []
      menuIds.value = res
      res.forEach((item) => {
        const node = treeRef.value.getNode(item)
        if (node != null && node.isLeaf) {
          treeRef.value.setChecked(node, true)
        }
        if (node != null && !node.checked) {
          node.indeterminate = true
        }
      })
    })
    visible.value = true
  }
  const onClose = () => {
    visible.value = false
    emit('refresh')
  }
  defineExpose({ onOpen })

  // defaultProps
  const defaultProps = {
    label: 'menuName',
    children: 'childrenList'
  }
</script>
