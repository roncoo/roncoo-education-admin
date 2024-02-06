<!--全局上传文件列表组件-->
<template>
  <div v-show="fileList.length > 0" class="fixed_upload_panel">
    <div class="upload_file_container" :class="{'hidden_list': !listing}">
      <div class="upload_head">
        <div class="upload_text">文件列表（{{ successFileList.length }}/{{ fileList.length }}）</div>
        <div class="dialog_btn">
          <el-icon v-if="!listing" class="" title="展开列表" @click="listing = true">
            <FullScreen/>
          </el-icon>
          <el-icon v-else class="ctrl_min_btn" title="最小化" @click="listing = false">
            <Minus/>
          </el-icon>
          <el-icon title="关闭" @click="handleClosePanel">
            <Close/>
          </el-icon>
        </div>
      </div>
      <div v-show="listing" class="upload_file_list">
        <div v-for="item in fileList" :key="item.uid" class="upload_file_item">
          <div class="file_name">{{ item.fileName }}</div>
          <div class="file_size">{{ transformSize(item.fileSize) }}</div>
          <div class="file_progress_number">{{ item.progress }} %</div>
          <div class="file_status c-brand">{{ STATUSTIP[item.status] }}</div>
          <div v-if="item.status === 'uploading'" class="file_ctrl_btn" @click.stop="stopUpload(item)">
            <el-icon>
              <VideoPause/>
            </el-icon>
          </div>
          <div v-if="item.status === 'fail'" class="file_ctrl_btn" @click.stop="startUpload(item)">
            <el-icon>
              <VideoPlay/>
            </el-icon>
          </div>
          <div v-if="item.status === 'stop'" class="file_ctrl_btn" @click.stop="resumeUpload(item)">
            <el-icon>
              <VideoPlay/>
            </el-icon>
          </div>
          <div class="file_progress" :style="{width: item.progress + '%'}"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import {useUploadStore} from "@/store/modules/upload";
import {transformSize} from "@/utils/base";
import {handleFile, handlePic, handleVod, STATUSTIP, UploadFile} from "@/components/Upload/File/upload";
import {ElMessageBox} from "element-plus";

// 文件
const fileList = ref<UploadFile[]>([])
const successFileList = ref<UploadFile[]>([])

// 监听
watch(
    [useUploadStore().getFileList, useUploadStore().getSuccessFileList],
    (newValue: any) => {
      fileList.value = newValue[0]
      successFileList.value = newValue[1]
      // 开始上传
      startUpload()
    }
)

// 状态
const listing = ref(true)

// 上传
const startUpload = (row?: UploadFile) => {
  let startFile: UploadFile | undefined = row
  if (!startFile) {
    fileList.value.map((item: UploadFile) => {
      if (item.status === 'ready' && !startFile) {
        startFile = item
      }
    })
  }
  if (startFile) {
    listing.value = true
    startFile.status = 'doing'
    console.log(startFile)
    if (startFile.resourceType === 1 || startFile.resourceType === 2) {
      // 视频、音频上传
      handleVod(startFile)
    } else if (startFile.resourceType === 4) {
      // 图片
      handlePic(startFile)
    } else {
      // 文档、压缩文件上传
      handleFile(startFile)
    }
  }
}

// 暂停上传
const stopUpload = (row: UploadFile) => {
  if (row.vodPlatform === 1) {

  }
}

// 关闭面板
const handleClosePanel = () => {
  let startFile: UploadFile | undefined
  fileList.value.map((item: UploadFile) => {
    if (item.status !== 'success') {
      startFile = item
    }
  })
  if (startFile) {
    ElMessageBox.confirm('没上传完成的文件将不再上传，确认要关闭？', '文件列表', {
      type: 'warning',
      cancelButtonText: '取消',
      confirmButtonText: '确认'
    }).then(async () => {
      clear()
    });
  } else {
    clear()
  }
}

const clear = () => {
  useUploadStore().clearFile()
  useUploadStore().clearSuccessFile()
}
</script>

<style lang="less" scoped>
.fixed_upload_panel {
  position: fixed;
  right: 10px;
  bottom: 20px;
  z-index: 9999;
}

.upload_file_container {
  background-color: #fff;
  box-shadow: -1px -1px 4px #ddd;
  border-radius: 6px 0 0 0;
  overflow: hidden;
  width: 540px;
  transition: width .3s;

  &.hidden_list {
    width: 250px;
  }

  .upload_head {
    display: flex;
    padding: 0 12px;
    line-height: 40px;
    color: #666;
    background-color: #f7f7f7;
    border-bottom: 1px solid #eee;

    .upload_text {
      flex: 1;
    }
  }

  .dialog_btn {
    text-align: right;
    width: 100px;

    i {
      cursor: pointer;
      padding: 4px;
      font-size: 18px;
    }

    .ctrl_min_btn {
      transform: rotateX(180deg);
    }
  }
}

.upload_file_list {
  width: 540px;
  max-height: 30vh;
  overflow: auto;

  .upload_file_item {
    position: relative;
    padding: 0 10px;
    display: flex;
    line-height: 45px;
    border-bottom: 1px solid #dedede;
    font-size: 12px;

    div {
      padding: 0 12px;
      position: relative;
      z-index: 2;
    }

    .file_type {
      padding: 0;
      font-size: 18px;
    }

    .file_name {
      width: 200px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .file_size {
      width: 60px;
      color: #666;
      text-align: center;
    }

    .file_status {
      text-align: center;
      width: 60px;
    }

    .file_ctrl_btn {
      font-size: 20px;
      color: #237cc3;
    }

    .file_progress {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 0;
      z-index: 1;
      padding: 0;
      background: #ebf7fe;
      transition: width .5s;
    }
  }
}
</style>
