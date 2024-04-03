<template>
  <div class="table-catalog">
    <div class="table-catalog-title">
      <span style="cursor: pointer">章节目录</span>
      <el-button text link style="margin-left: 120px" @click="openFormCatalog(null, props.treeData[0].courseId)">
        <el-icon>
          <CirclePlus />
        </el-icon>
      </el-button>
    </div>
    <el-tree
      ref="treeRef"
      :data="props.treeData"
      :props="{ value: 'id', label: 'chapterName', children: 'childrenList' }"
      :expand-on-click-node="false"
      node-key="id"
      draggable
      highlight-current
      @node-drop="handleDrop"
      @node-click="handleClick"
    >
      <template #default="{ data }">
        <span class="table-catalog-item">
          <span class="table-catalog-name">{{ data.chapterName }}</span>
          <span class="table-catalog-dropdown">
            <el-dropdown style="margin-top: 3px">
              <el-icon><More /></el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <span>
                    <el-dropdown-item @click="openFormCatalog(data, null)">重命名</el-dropdown-item>
                  </span>
                  <span>
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
  <chapter-form ref="chapterRef" @refresh="handleList" />
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import { courseApi } from '@/api/course'
  import ChapterForm from './ChapterForm.vue'
  import { ElMessage } from 'element-plus'

  const props = defineProps({
    treeData: {
      type: Object,
      default: null
    },
    chapterId: {
      type: String,
      default: ''
    }
  })

  const chapterId = computed(() => {
    return props.chapterId
  })

  const treeRef = ref()
  onMounted(() => {
    treeRef['value'].setCurrentKey(chapterId.value)
  })

  const emit = defineEmits(['node-click', 'refresh'])
  // 选择目录
  const handleClick = (item) => {
    emit('node-click', item)
  }

  const handleDrop = () => {
    const sortList = getTreeSort(props.treeData, 1)
    courseApi.courseChapterSort(sortList).then((res) => {
      ElMessage.success(res)
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
    courseApi.courseChapterDelete(item).then((res) => {
      ElMessage.success(res)
      emit('refresh')
    })
  }

  // 添加/修改文件夹
  const chapterRef = ref()
  const openFormCatalog = (item, courseId) => {
    chapterRef.value.onOpen(item, courseId)
  }

  const handleList = () => {
    emit('refresh')
  }
</script>
<style lang="scss" scoped>
  .table-catalog {
    display: block;
    min-height: calc(100vh - 220px);
    width: 250px;
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

  .el-tree-node__content {
    height: 45px;
  }
</style>
