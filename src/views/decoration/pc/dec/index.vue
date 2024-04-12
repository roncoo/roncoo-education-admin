<template>
  <div class="app-container">
    <!-- 顶部 -->
    <div class="top">
      <span class="top-back" @click="goBack">退出编辑</span>
      <span>PC端首页-正在装修···</span>
      <el-button type="primary" @click="onSubmit">保存并应用</el-button>
    </div>

    <section class="container-main">
      <!-- 左边栏 -->
      <section class="main-left">
        <el-scrollbar>
          <div>组件</div>
          <div>组件</div>
          <div>组件</div>
          <div>组件</div>
          <div>组件</div>
          <div>组件</div>
          <div>组件</div>
          <div>组件</div>
          <div>组件</div>
          <div>组件</div>
          <div>组件</div>
          <div>组件</div>
          <div>组件</div>
        </el-scrollbar>
      </section>

      <!-- 中间栏 -->
      <section class="main-body">
        <el-scrollbar>
          <span>组件33333333333列表</span>
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
  const router = useRouter()

  // 保存并应用
  const onSubmit = () => {
    //
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
      width: 100px;
      height: 100%;
      background: #fff;
      text-align: center;
    }

    .main-body {
      float: left;
      width: calc(100% - 420px);
      margin-left: 10px;
      background: #fff;
      height: 100%;
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
      cursor: pointer;
    }
  }
</style>
