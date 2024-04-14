<template>
  <div class="app-container">
    <!-- 顶部 -->
    <div class="top">
      <span class="top-back" @click="goBack">
        <el-icon><ArrowLeft /></el-icon>退出编辑
      </span>
      <span>PC端首页-正在装修···</span>
      <el-button type="primary" @click="onSubmit">保存并应用</el-button>
    </div>

    <section class="container-main">
      <!-- 左边栏 -->
      <section class="main-left">
        <el-scrollbar>
          <div class="main-left-name">组件</div>
          <draggable :list="menuList" :group="{ name: 'list', pull: 'clone' }" :clone="cloneDeep" :sort="false" item-key="key" class="main-left-list">
            <template #item="{ element }">
              <el-button class="menu-name">{{ element.name }}</el-button>
            </template>
          </draggable>
        </el-scrollbar>
      </section>

      <!-- 中间栏 -->
      <section class="main-body">
        <el-scrollbar>
          <div class="main-left-name">组件</div>
          <draggable :list="contentList" :group="{ name: 'list', put: true }" item-key="key" class="main-body-list">
            <template #item="{ element }">
              <div>
                <component :is="getComponent(element.key)"></component>
              </div>
            </template>
          </draggable>
        </el-scrollbar>
      </section>

      <!-- 右边栏 -->
      <section class="main-right">
        <div>
          <span>组件列333333333333表</span>
        </div>
      </section>
    </section>
  </div>
</template>
<script setup>
  import draggable from 'vuedraggable'
  import { ElMessageBox } from 'element-plus'
  import { useRouter } from 'vue-router'
  import { cloneDeep } from '@/utils/base'
  import { reactive, ref } from 'vue'
  import widget from '@/components/Decoration/widget.js'

  const router = useRouter()

  const menuList = [
    { key: 'CarouselView', name: '轮播组件' },
    { key: 'CourseView', name: '课程组件' }
  ]

  const contentList = reactive([])

  // 保存并应用
  const onSubmit = () => {
    //
  }

  //
  const getComponent = (name) => {
    console.log(name)
    return widget[name]
  }

  // 返回
  const goBack = () => {
    ElMessageBox.confirm('退出编辑将不会保存已编辑内容，确认离开？', '温馨提示', {
      type: 'warning',
      cancelButtonText: '取消',
      confirmButtonText: '确认'
    }).then(() => {
      router.go(-1)
    })
  }
</script>
<style lang="scss" scoped>
  .container-main {
    margin-top: 54px;
    text-align: center;
    background: #ddd;
    height: calc(100vh - 54px);
    .main-left {
      float: left;
      width: 120px;
      height: 100%;
      background: #fff;
      text-align: center;
      .main-left-name {
        padding: 10px;
      }
      .main-left-list .menu-name {
        margin: 5px 0;
      }
    }

    .main-body {
      float: left;
      width: calc(100% - 440px);
      max-width: 1200px;
      margin-left: 10px;
      background: #fff;
      height: 100%;
      .main-body-list {
        min-height: calc(100vh - 100px);
      }
    }

    .main-right {
      float: right;
      width: 300px;
      height: 100%;
      background: #fff;
    }
  }
  .top {
    z-index: 102;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 54px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    background: #ffffff;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.06);
    .top-back {
      line-height: 54px;
      cursor: pointer;
    }
  }
</style>
