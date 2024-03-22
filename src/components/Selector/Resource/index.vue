<template>
  <el-dialog :append-to-body="true" :model-value="props.visible" :title="props.title" width="800px" align-center @close="handleClose" :destroy-on-close="true">
    <el-tabs v-if="props.resourceType === 0" v-model="activeName" @tab-click="handleTablClick">
      <el-tab-pane :label="'全部'" :name="0" :key="0" />
      <el-tab-pane v-for="item in tabPanes" :label="item.desc" :name="item.code" :key="item.code" />
    </el-tabs>
    <el-form :model="query" class="filter-container" inline label-width="100px">
      <el-form-item label="资源名称">
        <el-input v-model="query.resourceName" />
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" @click="handleQuery">查询</el-button>
        <el-button class="filter-item" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="table-container">
      <!-- 目录 -->
      <cascader-category :category-type="2" v-model:category-id="query.categoryId" @refresh="handlePage" />
      <div class="table-main">
        <div v-if="props.resourceType === 4" class="table-main-card" v-loading="page.loading">
          <div class="table-main-card-item" v-for="(item, index) in page.list" :key="index" @click="handleCard(item)">
            <div v-if="item['check']" class="card-check" />
            <img class="table-main-card-item-img" :src="item.resourceUrl" />
            <div class="table-main-card-item-name">{{ item.resourceName }}</div>
          </div>
        </div>
        <el-table v-else v-loading="page.loading" :data="page.list">
          <el-table-column align="center" label="序号" type="index" width="60" />
          <el-table-column label="资源名称" prop="resourceName" />
          <el-table-column label="资源类型" prop="resourceType" :width="200">
            <template #default="scope">
              <span>
                <enum-view :enum-name="'ResourceTypeEnum'" :enum-value="scope.row.resourceType" />
                【<span v-if="scope.row.resourceType < 3"> <enum-view :enum-name="'VodPlatformEnum'" :enum-value="scope.row.vodPlatform" /></span>
                <span v-else><enum-view :enum-name="'StoragePlatformEnum'" :enum-value="scope.row.storagePlatform" /></span>】
              </span>
              <br />
              <span v-if="scope.row.resourceType < 3">{{ formatTime(scope.row.videoLength) }}</span>
              <span v-if="scope.row.resourceType === 3">{{ scope.row.docPage }} 页</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="scope">
              <el-button type="primary" @click="selectResource(scope.row)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination :total="page.totalCount" v-model:current-page="page.pageCurrent" v-model:page-size="page.pageSize" @pagination="handlePage" />
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose()">取消</el-button>
        <el-button type="primary" @click="handleSubmit()">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import { onMounted, reactive, ref } from 'vue'
  import useTable from '@/utils/table'
  import { courseApi } from '@/api/course'
  import Pagination from '@/components/Pagination/index.vue'
  import { formatTime, getEnumList } from '@/utils/base'
  import EnumView from '@/components/Enum/View/index.vue'
  import CascaderCategory from '@/components/Cascader/Category/index.vue'

  const props = defineProps({
    title: {
      type: String,
      default: '选择资源'
    },
    visible: {
      type: Boolean,
      default: false
    },
    resourceType: {
      type: Number,
      default: 0
    }
  })

  // 卡片
  const itemList = ref([])
  const handleCard = (item) => {
    console.log(item)
    item.check = !item.check
    const ids = itemList.value.map((el) => el.id)
    if (item.check) {
      if (ids.indexOf(item.id) === -1) {
        itemList.value.push(item)
      }
    } else {
      if (ids.indexOf(item.id) > -1) {
        itemList.value.splice(ids.indexOf(item.id), 1)
      }
    }
  }

  // 提交
  const handleSubmit = () => {
    emit('close', itemList.value)
  }

  const activeName = ref(props.resourceType)
  const tabPanes = ref()
  onMounted(async () => {
    tabPanes.value = await getEnumList('ResourceTypeEnum')
  })
  const handleTablClick = (tab) => {
    activeName.value = tab.props.name
    query.resourceType = tab.props.name
    handleQuery()
  }

  const emit = defineEmits(['close'])
  const selectResource = (info) => {
    emit('close', info)
  }

  // 关闭
  const handleClose = () => {
    emit('close')
  }

  // 基础功能
  const { page, handlePage, query, handleQuery, resetQuery } = reactive({
    ...useTable(
      {
        page: courseApi.resourcePage
      },
      {
        resourceType: props.resourceType
      }
    )
  })
</script>

<style lang="scss" scoped>
  .example-showcase .el-loading-mask {
    z-index: 99;
  }

  .table-container {
    display: flex;
    max-height: calc(50vh);
    overflow: auto;
  }

  .table-main {
    width: calc(100% - 200px);
    max-height: calc(100vh - 300px);
  }
  .table-main-card {
    display: flex;
    flex-wrap: wrap;
    .table-main-card-item {
      cursor: pointer;
      margin: 10px;
      width: 150px;
      position: relative;
      overflow: hidden;
      .table-main-card-item-img {
        height: 100px;
        width: 100%;
        object-fit: cover;
      }
      .table-main-card-item-name {
        margin-top: 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }

  .card-check {
    width: 60px;
    height: 60px;
    top: -30px;
    right: -30px;
    position: absolute;
    background: #3d7fff;
    transform: rotate(45deg);
  }
  .card-check:before {
    background-image: url('../../../assets/svg/check.svg');
    background-repeat: no-repeat;
    content: '';
    width: 14px;
    height: 14px;
    color: #fff;
    position: absolute;
    display: flex;
    left: 24px;
    bottom: 5px;
    transform: rotate(319deg);
    align-items: center;
    justify-content: center;
    font-weight: bold;
    letter-spacing: 2px;
  }
</style>
