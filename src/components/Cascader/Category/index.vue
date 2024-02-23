<template>
  <div class="table-catalog">
    <div class="table-catalog-title">
      <span>资源目录</span>
      <el-button text link style="margin-left: 70px" @click="openFormCatalog(null, null)">
        <el-icon>
          <CirclePlus />
        </el-icon>
      </el-button>
    </div>
    <el-tree :data="treeData" :props="{ value: 'id', label: 'categoryName', children: 'childrenList' }" node-key="id" @node-click="handleChangeCategory">
      <template #default="{ node, data }">
        <span
          ><el-icon><Folder /></el-icon
        ></span>
        <span class="table-catalog-name">{{ data.categoryName }}</span>
        <span class="table-catalog-dropdown" :class="{ active: data.id === categoryId }">
          <el-dropdown trigger="click" style="margin-top: 3px">
            <el-icon><More /></el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="openFormCatalog(data, data.id)">添加子文件夹</el-dropdown-item>
                <el-dropdown-item @click="openFormCatalog(data, null)">修改</el-dropdown-item>
                <el-dropdown-item @click="deleteCatalog(data)">删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </span>
      </template>
    </el-tree>
  </div>
  <form-category ref="catalogRef" @refresh="handleCatalog" />
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import { courseApi } from '@/api/course'
  import FormCategory from './FormCategory.vue'

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

  const categoryId = ref(props.categoryId)

  const emit = defineEmits(['update:category-id', 'refresh'])
  //
  const handleChangeCategory = (item) => {
    emit('update:category-id', item.id)
    emit('refresh')
  }

  // 删除文件夹
  const deleteCatalog = (item) => {
    console.log(item)
  }

  // 添加/修改文件夹
  const catalogRef = ref()
  const openFormCatalog = (item, parentId) => {
    catalogRef.value.onOpen(item, parentId)
  }

  // 列出文件夹
  const treeData = ref()
  onMounted(() => {
    handleCatalog()
  })
  const handleCatalog = () => {
    courseApi.categoryList({ categoryType: props.categoryType }).then((res) => {
      treeData.value = res
    })
  }
</script>
<style lang="scss" scoped>
  .table-catalog {
    display: block;
    min-height: calc(100vh - 180px);
    margin-bottom: 52px;
    width: 200px;
    border: 1px solid #ebeef5;

    .table-catalog-title {
      cursor: default;
      padding: 10px 20px;
    }

    .table-catalog-name {
      margin-left: 5px;
      width: 100px;
    }

    .table-catalog-dropdown {
      display: none;
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
