<template>
  <uploader
      :options="options"
      :file-status-text="statusText"
      ref="uploaderRef"
      @file-complete="fileComplete"
      @complete="complete"
  >
    <uploader-unsupport></uploader-unsupport>
    <uploader-btn class="el-button">本地上传</uploader-btn>
    <div class="file-uploader">
      <div class="file-title">
        <div class="title">文件列表</div>
        <div class="operate">
          <el-button
              @click="collapse = !collapse"
              type="text"
              :title="collapse ? '展开' : '折叠'"
          >
            <i class="iconfont" :class="collapse ? 'el-icon-full-screen' : 'el-icon-minus'"></i>
          </el-button>
          <el-button @click="close" type="text" title="关闭">
            <i class="el-icon-close"></i>
          </el-button>
        </div>
      </div>

      <uploader-list></uploader-list>
    </div>

  </uploader>
</template>

<script setup lang="ts">
import {nextTick, onMounted, ref} from 'vue'

const uploaderRef = ref()
const options = {
  target: '//localhost:3000/upload', // '//jsonplaceholder.typicode.com/posts/',
  testChunks: false
}
const statusText = {
  success: '成功',
  error: '失败',
  uploading: '上传中',
  paused: '暂停',
  waiting: '等待'
}
const complete = () => {
  console.log('complete', arguments)
}
const fileComplete = () => {
  console.log('file complete', arguments)
}
onMounted(() => {
  nextTick(() => {
    window.uploader = uploaderRef.value.uploader
  })
})
</script>

<style lang="less" scoped>
/* https://github.com/shady-xia/vue-uploader-solutions/blob/master/vue-simple-uploader/GlobalUploader.vue */

.uploader-btn {
  margin-right: 4px;
}

.file-uploader {
  position: fixed;
  right: 10px;
  bottom: 20px;
  z-index: 10;
  background-color: #fff;
  border: 1px solid #cdcdcd;
  width: 25%;

  .file-uploader-header {
    height: 20px;

    .tips {
      line-height: 20px;
    }
  }

  .file-title {
    display: flex;
    height: 40px;
    line-height: 40px;
    padding: 0 15px;
    border-bottom: 1px solid #ddd;

    .operate {
      flex: 1;
      text-align: right;

      i {
        font-size: 18px;
      }
    }
  }
}

.uploader-btn {
  margin-left: 12px;
  background-color: #3D7FFF;
  color: #fff;
  padding: 5px 10px;
  border-radius: 4px;
  border: none;
}

.uploader-list {
  width: 100%;
}
</style>