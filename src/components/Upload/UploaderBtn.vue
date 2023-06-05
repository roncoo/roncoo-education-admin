<!--
** 上传文件按钮
** params
**** refId: 关联ID， 如果存在，上传完成后自动调用关联接口，把资源与关联ID关联
**** fileType: 文件类型： video(视频)、image(图片)、 pdf、audio(音频)
**** mode: 上传模式： async(后台上传，不影响业务操作，上传完成关联refId) await(等待上传，上传完成执行回调，业务需要等待完成才可以继续进行)
**** @success 成功回调函数，mode=await时进行回调，返回文件名及文件链接
-->
<template>
  <div v-if="fileInfo.status === 'uploading'" class="upload-btn uploading_panel" style="width: 80px;">
    <el-progress class="progress-panel" :text-inside="true" :stroke-width="28" :percentage="fileInfo.progress" />
    <el-button class="close-btn" plain type="primary" @click="handleCloseUpload">{{ $t('cancelUpload') }}</el-button>
  </div>
  <span v-else>
    <el-upload
      ref="local"
      multiple
      class="upload-btn"
      action="#"
      :show-file-list="false"
      :accept="accept"
      :on-change="handleChange"
      :before-upload="handleBeforeUpload"
      :http-request="upload"
    > <el-button :icon="icon" :type="btnType" :plain="plain" :class="btnClass">
      {{ btnText }}
      <slot name="btn-content" />
    </el-button>
    </el-upload>
  </span>
</template>

<script>
import uploadVideo from '@/utils/mixin/uploadVideo';
import uploadFiles from '@/utils/mixin/UploadFiles';
import {mapGetters} from 'vuex';
import {uploadDoc, saveResource} from '@/api/upload';
import {ElMessage} from 'element-plus';
export default {
  name: 'UploaderBtn',
  mixins: [uploadVideo, uploadFiles],
  props: {
    refId: { // 关联ID
      type: [String, Number],
      default: ''
    },
    imageTip: {
      type: String,
      default: ''
    },
    imageSize: {
      type: Number,
      default: 10
    },
    fileType: { // 文件类型
      type: String,
      default: 'file'
    },
    btnText: { // 按钮文本
      type: String,
      default: '点击上传'
    },
    plain: { // 是否为朴素按钮
      type: Boolean,
      default: true
    },
    icon: { // 按钮icon
      type: String,
      default: ''
    },
    btnType: { // 按钮类型
      type: String,
      default: 'primary'
    },
    custom: { // 保存文件拓展字段
      type: Object,
      default: () => {
        return {}
      }
    },
    maxLength: { // 最大上传数量
      type: Number,
      default: 5
    },
    mode: { // 文件类型
      type: String,
      default: 'await'
    },
    btnClass: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      fileList: [],
      fileInfo: {},
      fileTypeInt: {'video': 1, 'audio': 2, 'document': 3, 'zip': 5, 'image': 4}
    }
  },
  computed: {
    ...mapGetters({
      'websiteInfo': 'app/websiteInfo'
    }),
    accept() {
      if (this.fileType === 'video') {
        return 'video/mp4,video/avi,video/mpg,video/mpeg,video/ram,video/flv,video/mov,video/asf,video/3gp,video/f4v,video/wmv,video/x-ms-wmv'
      } else if (this.fileType === 'image') {
        return 'image/jpeg,image/png,image/gif,image/x-icon'
      } else if (this.fileType === 'audio') {
        return 'audio/mpeg,audio/wma,audio/wav,audio/ape,audio/flac,audio/ogg,audio/aac'
      } else if (this.fileType === 'document') {
        return '.pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx'
      } else if (this.fileType === 'zip') {
        return '.zip,.rar'
      }
      return '*'
    }
  },
  methods: {
    handleChange(file, fileList) {
      if (fileList.length > 1) {
        fileList.splice(0, 1);
      }
    },
    upload(file) {
      this.status = 1
      if (this.mode === 'async') {
        this.$store.dispatch('upload/uploadFile', {refId: this.refId, file: file.file, custom: this.custom})
      } else {
         this.awaitUpload(file.file)
      }
    },
    awaitUpload(_file) {
      const type = _file.type.split('/')
      const fileInfo = {
        status: 'ready',
        name: _file.name,
        size: _file.size,
        type: type[0],
        uid: _file.uid,
        progress: 0,
        file: _file
      }
      let name = ''
      const nameType = _file.name.split('.')
      const nameTypes = nameType[nameType.length - 1]
      if (_file.type) {
        name = _file.type.split('/')[0]
      } else {
        if (['3gp', 'asf', 'avi', 'dat', 'flv', 'f4v', 'm4v', 'mkv', 'mov', 'mp4', 'mpe', 'mpg', 'mpeg', 'rmvb', 'vob', 'wmv'].indexOf(nameTypes) > -1) {
          name = 'video'
          _file.resourceType = 1
        } else if (['aac', 'wav', 'wma', 'mp3'].indexOf(nameTypes) > -1) {
          name = 'audio'
          _file.resourceType = 2
        } else if (['png', 'jpg', 'jpeg'].indexOf(nameTypes) > -1) {
          name = 'image'
          _file.resourceType = 4
        } else if (['zip', 'rar'].indexOf(nameTypes) > -1) {
          name = 'zip'
          _file.resourceType = 5
        } else if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'ppt', 'pptx'].indexOf(nameTypes) > -1) {
          name = 'document'
          _file.resourceType = 3
        }
      }
      this.fileInfo = fileInfo
      if (name === 'video' || name === 'audio') {
        this.startUpload(fileInfo)
      } else if (name === 'image') {
        this.UploadFile(fileInfo, (data) => {
          this.$emit('success', data)
        })
      } else if (['zip', 'pdf'].indexOf(name) > -1) {
        this.UploadDoc(fileInfo)
      }
    },
    handleExceed() {
      this.$refs.local.clearFiles()
      ElMessage.error('单次最多上传5个文件')
    },
    handleBeforeUpload(file) {
      if (file.size === 0) {
        ElMessage.error('不能上传大小为0kb的文件')
        return false
      }
      let name = ''
      const nameType = file.name.split('.')
      const nameTypes = nameType[nameType.length - 1]?.toLowerCase();
      if (['3gp', 'asf', 'avi', 'dat', 'flv', 'f4v', 'm4v', 'mkv', 'mov', 'mp4', 'mpe', 'mpg', 'mpeg', 'rmvb', 'vob', 'wmv'].indexOf(nameTypes) > -1) {
        name = 'video'
      } else if (['aac', 'wav', 'wma', 'mp3'].indexOf(nameTypes) > -1) {
        name = 'audio'
      } else if (['png', 'jpg', 'jpeg'].indexOf(nameTypes) > -1) {
        name = 'image'
      } else if (['zip', 'rar'].indexOf(nameTypes) > -1) {
        name = 'zip'
      } else if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'ppt', 'pptx'].indexOf(nameTypes) > -1) {
        name = 'document'
      }
      switch (name) {
        case 'video':
          return this.beforeUploadVideo(name, nameTypes, file)
        case 'audio':
          return this.beforeUploadAudio(name, nameTypes, file)
        case 'image':
          return this.beforeUploadPic(name, nameTypes, file)
        case 'document':
          return this.beforeUploadDocument(name, nameTypes, file)
        case 'zip':
          return this.beforeUploadRar(name, nameTypes, file)
        default:
          ElMessage.error(this.$t('uploader.uploadError'))
          return false
      }
    },
     beforeUploadPic(type, nameType, file) {
      // const ids = this.$store.state.upload.fileList.map(el => el.resourceName)
      // if (ids.indexOf(file.name) > -1) {
      //   ElMessage.error(this.$t('learn.errorName'))
      //   return false
      // }
      const isLt10M = file.size / 1024 / 1024 < this.imageSize;
      if (['jpg', 'jpeg', 'png'].indexOf(nameType) === -1) {
        ElMessage.error(this.$t('uploader.errorUploadPic'))
        return false
      }
      if (!isLt10M) {
        ElMessage.error(this.imageTip || this.$t('uploader.errorUploadPicSize'))
        return false;
      }
    },
     beforeUploadVideo(type, nameType, file) {
      const isLt10G = file.size / 1024 / 1024 / 1024 < 10;
      if (['3gp', 'asf', 'avi', 'dat', 'flv', 'f4v', 'm4v', 'mkv', 'mov', 'mp4', 'mpe', 'mpg', 'mpeg', 'rmvb', 'vob', 'wmv'].indexOf(nameType) === -1) {
        ElMessage.error(this.$t('uploader.errorUploadVideo'))
        return false
      }
      if (!isLt10G) {
        ElMessage.error(this.$t('uploader.errorUploadVideoSize'))
        return false;
      }
    },
     beforeUploadAudio(type, nameType, file) {
      const isLt1G = file.size / 1024 / 1024 / 1024 < 1;
      if (['aac', 'wav', 'wma', 'mp3'].indexOf(nameType) === -1) {
        ElMessage.error(this.$t('uploader.errorUploadAudio'))
        return false
      }
      if (!isLt1G) {
        ElMessage.error(this.$t('uploader.errorUploadAudioSize'))
        return false;
      }
    },
     beforeUploadDocument(type, nameTypes, file) {
      // const ids = this.$store.state.upload.fileList.map(el => el.resourceName)
      // if (ids.indexOf(file.name) > -1) {
      //   ElMessage.error(this.$t('learn.errorName'))
      //   return false
      // }
      if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'ppt', 'pptx'].indexOf(nameTypes) > -1) {
        const isLt1G = file.size / 1024 / 1024 / 1024 < 1;
        if (!isLt1G) {
          ElMessage.error(this.$t('uploader.errorUploadDocumentSize'))
          return false;
        }
      } else {
        ElMessage.error(this.$t('uploader.uploadErrorDocumentMessage'))
        return false;
      }
    },
    beforeUploadRar(type, nameTypes, file) {
      // const ids = this.$store.state.upload.fileList.map(el => el.resourceName)
      // if (ids.indexOf(file.name) > -1) {
      //   ElMessage.error(this.$t('learn.errorName'))
      //   return false
      // }
      if (['zip', 'rar'].indexOf(nameTypes) === -1) {
        ElMessage.error(this.$t('uploader.errorUploadZip'))
        return false
      } else {
        type = 'zip'
      }
      if (type === 'zip') {
        const isLt2G = file.size / 1024 / 1024 / 1024 < 2;
        if (!isLt2G) {
          ElMessage.error('uploader.errorUploadZipSize')
          return false;
        }
      } else {
        ElMessage.error(this.$t('uploader.uploadZipErrorMessage'))
        return false
      }
    },
    uploadDoc(_file) {
      const that = this
      uploadDoc(_file, {
        progress: function(p, checkpoint) {
          // 断点记录点。浏览器重启后无法直接继续上传，您需要手动触发上传操作。
          _file.tempCheckpoint = checkpoint;
          console.log(checkpoint, p)
          _file.progress = parseInt(p * 100)
          _file.status = 'uploading'
        },
        // parallel: 5, // 分片数量
        // partSize: 1024 * 1024 * 40, // 分片大小
        meta: { year: 2020, people: 'test' },
        mime: _file.file.type
      }).then(result => {
        that.fileUploading = false
        _file.status = 'success'
        _file.file = null;
        _file.tempCheckpoint = null;
        // 3 就是pdf 要设置动态读取 有权限读取 视频音频都是冷读取的一个月只读一次
        if (_file.type === 'pdf') {
          this.aliFileClient.putACL(result.name, 'private')
        }
        const fileUrl = that.aliyunOssUrl + result.name
        const _data = {
          url: fileUrl,
          name: _file.name
        }
        if (that.saveFile) that.saveFile(_data, _file);
      }).catch(error => {
        that.fileUploading = false
        console.error(error)
        if (error.status === 0) {
          _file.status = 'stop'
        } else {
          _file.status = 'fail'
        }
      })
    },
    // 取消上传
    handleCloseUpload() {
      if (this.fileInfo.type === 'video') {
        this.stopUpload(this.fileInfo)
      } else {
        this.stopUploadFile(this.fileInfo)
      }
    },
    // 保存文件
    savaFile(data, fileInfo) {
      if (this.refId) {
        const refId = this.refId === '0' ? undefined : this.refId
        const form = {
          userNo: refId,
          resourceName: fileInfo.name,
          vodPlatform: fileInfo.videoType,
          resourceType: this.fileTypeInt[fileInfo.type],
          ...this.custom,
          ...fileInfo

        }
        if (data.vid) {
          form.videoVid = data.vid
        }
        fileInfo.status = 'save'
        saveResource(form).then(res => {
          fileInfo.status = 'saveSuccess'
          form.coursewareId = res.data
          this.$emit('success', form)
          // console.log(res)
        }).catch(() => {
          fileInfo.status = 'saveFail'
        });
      } else {
        this.$emit('success', data)
      }
      // this.nextUpload()
    },
    // 保存文件
    savaVideo(data, fileInfo) {
      console.log('savaVideo', data, fileInfo, this.refId)
      if (this.refId) {
        const refId = this.refId === '0' ? undefined : this.refId
        const form = {
          userNo: refId,
          materialName: fileInfo.name,
          vodPlatform: fileInfo.videoType,
          materialType: this.fileTypeInt[fileInfo.type],
          ...this.custom,
          ...fileInfo
        }
        if (data.vid) {
          form.vid = data.vid
        } else {
          form.ossUrl = data.url
        }
        fileInfo.status = 'save'
        saveResource(form).then(res => {
          console.log('saveResource', res)
          fileInfo.status = 'saveSuccess'
          form.coursewareId = res.data
          this.$emit('success', form)
          // console.log(res)
        }).catch(() => {
          fileInfo.status = 'saveFail'
        });
      } else {
        this.$emit('success', data)
      }
      // this.nextUpload()
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-btn{
  display: inline-block;
  // margin-left: 10px;
  // margin-right: 10px;
}
.uploading_panel{
  .progress-panel{
  }
  .close-btn{
    display: none;
  }
  &:hover{
    .progress-panel{
      display: none;
    }
    .close-btn{
      display: block;
    }
  }
}
</style>
<style lang="scss">
.uploading_panel{
  .el-progress-bar__outer, .el-progress-bar__inner{
    border-radius: 3px;
  }
}
</style>
