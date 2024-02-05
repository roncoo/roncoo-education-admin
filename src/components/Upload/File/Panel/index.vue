<!--全局上传文件列表组件-->
<template>
  <div v-show="fileList.length > 0" id="FixedUploadPanel" class="fixed_upload_panel">
    <div class="upload_file_container" :class="{'hidden_list': hideList}">
      <div class="upload_head">
        <div class="upload_text">文件列表（{{ successList.length }}/{{ fileList.length }}）</div>
        <div class="dialog_btn">
          <el-icon v-if="hideList" title="文件列表" @click="hideList = false">
            <el-icon-full-screen/>
          </el-icon>
          <el-icon v-else class="ctrl_min_btn" title="最小化" @click="hideList = true">
            <el-icon-copy-document/>
          </el-icon>
          <el-icon title="关闭" @click="onClosePanel">
            <el-icon-close/>
          </el-icon>
        </div>
      </div>
      <div v-show="!hideList" class="upload_file_list">
        <div v-for="item in fileList" :key="item.uid" class="upload_file_item">
          <div class="file_type"><i :class="item.type | fileType"/></div>
          <div class="file_name">{{ item.name }}</div>
          <div class="file_size">{{ getSize(item.size) }}</div>
          <div class="file_progress_number">{{ item.progress }} %</div>
          <div class="file_status c-brand">{{ tipList[item.status] }}</div>
          <div v-if="item.status === 'uploading'" class="file_ctrl_btn" @click.stop="stopUpload(item)">
            <el-icon class="">
              <el-icon-video-pause/>
            </el-icon>
          </div>
          <div v-if="item.status === 'fail'" class="file_ctrl_btn" @click.stop="startUpload(item)">
            <el-icon class="">
              <el-icon-video-play/>
            </el-icon>
          </div>
          <div v-if="item.status === 'stop'" class="file_ctrl_btn" @click.stop="resumeUpload(item)">
            <el-icon class="">
              <el-icon-video-play/>
            </el-icon>
          </div>
          <div class="file_progress" :style="{width: item.progress + '%'}"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useUploadStore} from "@/store/modules/upload";

// 文件列表
const fileList = ref([])
onMounted(() => {
  fileList.value = useUploadStore().fileList
})


// 关闭面板
const onClosePanel = () => {

}

//
// export default {
//   name: 'FixedUploadPanel',
//   filters: {
//     fileType(val) {
//       if (val === 'image') {
//         return 'el-icon-picture-outline'
//       } else if (val === 'video') {
//         return 'el-icon-video-play'
//       } else {
//         return 'el-icon-tickets'
//       }
//     }
//
//   },
//   mixins: [uploadVideo, uploadFiles],
//   data() {
//     return {
//       that: this,
//       fileTypeInt: {'video': 1, 'audio': 2, 'document': 3, 'image': 4, 'zip': 5},
//       hideList: false,
//       files: [],
//       tipList: {
//         success: this.$t('uploader.success'),
//         fail: this.$t('uploader.fail'),
//         uploading: this.$t('uploader.uploading'),
//         stop: this.$t('uploader.stop'),
//         save: this.$t('uploader.save'),
//         saveSuccess: this.$t('uploader.saveSuccess'),
//         saveFail: this.$t('uploader.saveFail'),
//         transcoding: this.$t('uploader.transcoding'),
//         md5: this.$t('uploader.md5'),
//         merging: this.$t('uploader.merging'),
//         ready: this.$t('uploader.other')
//       }
//     }
//   },
//   computed: {
//     fileList() {
//       return [...this.$store.getters['upload/fileList']]
//     },
//     successList() {
//       const arr = []
//       this.fileList.map(item => {
//         if (item.status === 'saveSuccess') {
//           arr.push(item)
//         }
//       })
//       return arr
//     }
//   },
//   watch: {
//     fileList() {
//       if (!this.uploading) {
//         this.beginUpload()
//       }
//     }
//   },
//   mounted() {
//     // console.log(this.$store.getters)
//     const _that = this
//     window.onbeforeunload = function(e) {
//       const event = window.event || e;
//       if (_that.successList.length !== _that.fileList.length) {
//         event.returnValue = (_that.$t('uploader.noUploadSuccess'));
//       }
//     }
//   },
//   methods: {
//     getSize,
//     fileStatus(val) {
//       if (this.tipList[val]) {
//         return this.tipList[val]
//       } else {
//         return this.tipList['other']
//       }
//     },
//     beginUpload() {
//       let startFile
//       this.fileList.map(item => {
//         if (item.status === 'ready' && !startFile) {
//           startFile = item
//         }
//       })
//       if (startFile) {
//         this.hideList = false;
//         console.log('------------')
//         console.log(startFile.type, startFile)
//         if (startFile.type === 'video' || startFile.type === 'audio') {
//           this.startUpload(startFile)
//         } else if (startFile.type === 'image') {
//           this.UploadFile(startFile)
//         } else {
//           this.UploadDoc(startFile)
//         }
//       }
//     },
//     savaVideo(data, fileInfo) {
//       this.saveFile(data, fileInfo)
//     },
//     // 保存文件
//     saveFile(data, fileInfo) {
//       console.log('FixedUploadPanelsaveFile')
//       const reg = /^(\/tch\/)/
//       let tid = ''
//       if (reg.test(this.$route.path)) {
//         tid = getSession('tchData').userId
//       }
//       console.log('form')
//       const form = {
//         vodPlatform: fileInfo.videoType,
//         materialType: this.fileTypeInt[fileInfo.type],
//         materialName: data.materialName,
//         materialSize: fileInfo.materialSize,
//         materialUrl: data.materialUrl,
//         storagePlatform: data.storagePlatform,
//         vodModel: fileInfo.vodModel,
//         countPage: data.pageCount,
//         width: data.width,
//         tid,
//         height: data.height,
//         vid: '',
//         ...fileInfo.custom
//       }
//       if (data.vid || data.fid) {
//         form.vid = data.vid || data.fid
//       }
//       this.$store.commit('upload/UPLOAD_FILE_STATUS', fileInfo)
//       fileInfo.status = 'save'
//       resourceLibrarySave(form).then(res => {
//         if (res) {
//           fileInfo.status = 'saveSuccess'
//           // console.log(res)
//           bus.emit('uploadFileSuccess')
//         } else {
//           fileInfo.status = 'saveFail'
//         }
//       }).catch(() => {
//         fileInfo.status = 'saveFail'
//       });
//       this.nextUpload()
//     },
//     // 上传下一个
//     nextUpload() {
//       console.log('下一个')
//       let startFile
//       this.fileList.map(item => {
//         if (item.status === 'ready' && !startFile) {
//           startFile = item
//         }
//       })
//       // console.log(startFile)
//       if (startFile) {
//         if (startFile.type === 'video' || startFile.type === 'audio') {
//           this.startUpload(startFile)
//         } else if (startFile.type === 'image') {
//           this.UploadFile(startFile)
//         } else {
//           this.UploadDoc(startFile)
//         }
//       } else {
//         this.hideList = true
//         this.uploading = false
//       }
//     },
//     // 关闭面板
//     handleClosePanel() {
//       let startFile
//       this.fileList.map(item => {
//         if (item.status !== 'saveSuccess') {
//           startFile = item
//         }
//       })
//       if (startFile) {
//         this.$confirm(this.$t('uploader.uploadingTip'), this.$t('uploader.warning'), {
//           type: 'warning',
//           cancelButtonText: this.$t('cancel'),
//           confirmButtonText: this.$t('determine')
//         }).then(() => {
//           this.$store.commit('upload/REMOVE_LIST')
//           this.uploading = false
//         });
//       } else {
//         this.$store.commit('upload/REMOVE_LIST')
//         this.uploading = false
//       }
//     }
//   }
// }
</script>

<style lang="less" scoped>
.fixed_upload_panel {
  position: fixed;
  right: 0;
  bottom: 0;
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
    padding: 0 20px;
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
      width: 80px;
      color: #666;
      text-align: center;
    }

    .file_status {
      text-align: center;
      width: 80px;
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
