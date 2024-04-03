<template>
  <div class="table-catalog">
    <div class="table-catalog-title">
      <span style="cursor: pointer" @click="handleChangeCategory">资源目录</span>
      <el-button text link style="margin-left: 70px" @click="openFormCatalog(null, null)">
        <el-icon>
          <CirclePlus />
        </el-icon>
      </el-button>
    </div>
    <el-tree
      ref="treeRef"
      :data="treeData"
      :props="{ value: 'id', label: 'categoryName', children: 'childrenList' }"
      :expand-on-click-node="false"
      highlight-current
      node-key="id"
      draggable
      @node-drop="handleDrop"
      @node-click="handleChangeCategory"
    >
      <template #default="{ data }">
        <span class="table-catalog-item">
          <img src="@/assets/images/folder.svg" />&nbsp;
          <span class="table-catalog-name">{{ data.categoryName }}</span>
          <span class="table-catalog-dropdown">
            <el-dropdown style="margin-top: 3px">
              <el-icon><More /></el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <span v-permission="'category:save'">
                    <el-dropdown-item @click="openFormCatalog(data, data.id)">添加子文件夹</el-dropdown-item>
                  </span>
                  <span v-permission="'category:edit'">
                    <el-dropdown-item @click="openFormCatalog(data, null)">修改</el-dropdown-item>
                  </span>
                  <span v-permission="'category:delete'">
                    <el-dropdown-item @click="deleteCatalog(data)">删除</el-dropdown-item>
                  </span>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </span>
        </span>
      </template>
    </el-tree>
  </div>
  <category-form ref="catalogRef" @refresh="handleCatalog" />
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import { courseApi } from '@/api/course'
  import CategoryForm from './CategoryForm.vue'
  import { ElMessage } from 'element-plus'

  const props = defineProps({
    categoryType: {
      type: Number,
      default: 0
    },
    categoryId: {
      type: String,
      default: ''
    }
  })

  const categoryId = computed(() => {
    return props.categoryId
  })

  const treeRef = ref()
  onMounted(() => {
    treeRef['value'].setCurrentKey(categoryId.value)
  })

  const emit = defineEmits(['update:category-id', 'refresh'])
  // 选择目录
  const handleChangeCategory = (item) => {
    emit('update:category-id', item.id)
    emit('refresh')
  }

  const handleDrop = () => {
    const sortList = getTreeSort(treeData.value, firstTree.value.sort)
    courseApi.categorySort(sortList).then((res) => {
      ElMessage.success(res)
      handleCatalog()
    })
  }

  const getTreeSort = (list, sort) => {
    return list.map((el, index) => {
      if (el['childrenList'] && el['childrenList'].length > 0) {
        el.children = getTreeSort(el['childrenList'], sort)
      }
      el.sort = sort + index
      return {
        id: el.id,
        sort: el.sort,
        childrenList: el.children
      }
    })
  }

  // 删除文件夹
  const deleteCatalog = (item) => {
    courseApi.categoryDelete(item).then((res) => {
      ElMessage.success(res)
      handleCatalog()
    })
  }

  // 添加/修改文件夹
  const catalogRef = ref()
  const openFormCatalog = (item, parentId) => {
    catalogRef.value.onOpen(item, parentId)
  }

  // 列出文件夹
  const treeData = ref()
  const firstTree = ref()
  onMounted(() => {
    handleCatalog()
  })

  // 列出目录
  const handleCatalog = () => {
    courseApi.categoryList({ categoryType: props.categoryType }).then((res) => {
      treeData.value = res
      firstTree.value = res[0]
    })
  }
</script>
<style lang="scss" scoped>
  .table-catalog {
    display: block;
    min-height: calc(100vh - 220px);
    width: 200px;
    margin-bottom: 52px;
    overflow: auto;
    border: 1px solid #ebeef5;

    .table-catalog-title {
      cursor: default;
      padding: 10px 20px;
    }

    .table-catalog-item {
      display: flex;
      align-items: center;
    }

    .table-catalog-name {
      position: relative;
      margin-left: 5px;
      overflow: hidden;
    }

    .table-catalog-dropdown {
      display: none;
      right: 0;
      position: absolute;
      background-color: #fff;
      margin: 0 auto;
      padding: 0 10px;
    }
  }

  .active {
    background-color: var(--el-tree-node-hover-bg-color);
  }

  .el-tree-node__content:hover {
    .table-catalog-dropdown {
      display: block;
    }
  }
</style>
