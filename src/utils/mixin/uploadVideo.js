import { mapGetters } from 'vuex'
import { vodConfig } from '@/api/upload'
import PlvVideoUpload from '@polyv/vod-upload-js-sdk';
import UploadFragment from '@/utils/mixin/UploadFragment';
// import uploaderCC from '@/utils/uploadCC'
export default {
  mixins: [UploadFragment],
  data() {
    return {
      videoPlatType: 1, // 视频平台 1私有云、2保利威、3百家云、4获得场景
      polyvClient: undefined, // 保利威SDK实例
      tempCheckpoint: undefined, // 续传对象
      directoryPath: '',
      cancelToken: {},
      uploading: false,
      bucket: '',
      uploadStatus: [],
      uploadList: [],
      isEncrypt: false,
      progress: 0,
      errorMessage: '',
      huanTuoUploaderList: {}
    }
  },
  filters: {
    uploadStatus(val, list) {
      if (val === 'success') {
        return list[val]
      } else if (val === 'fail') {
        return list[val]
      } else if (val === 'uploading') {
        return list[val]
      } else if (val === 'stop') {
        return list[val]
      } else if (val === 'save') {
        return list[val]
      } else if (val === 'saveSuccess') {
        return list[val]
      } else if (val === 'saveFail') {
        return list[val]
      } else {
        return list['other']
      }
    }
  },
  computed: {
    ...mapGetters({
      'websiteInfo': 'app/websiteInfo',
      'userToken': 'userToken'
    })
  },
  mounted() {
    // this.initOssConfig()
    this.errorMessage = ''
    // this.initPolyv()
  },
  methods: {

    startUpload(_file, cb) {
      console.log(_file)
      if (this.uploading) {
        return false
      }
      this.uploading = true
      this.initOssConfig(_file, res => {
        Object.assign(_file, res)
        _file.vodModel = res.vodModel
        if (this.videoPlatType === 2) {
          // 上传保利威
          this.getPolyvVideoSign(res.polyvConfig, () => {
            this.polyvUpload(_file, cb)
          })
        } else if (this.videoPlatType === 3) {
          // 上传百家云
          // this.baijiayunUpload(_file, cb)
        } else {
          // 其他的分片上传
          this.initSimpleUpload(JSON.parse(res.vodUploadConfig))
          this.fenpianUpload(_file, this.videoPlatType)
        }
      })
    },
    randomString(len = 32) {
      const $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';
      const maxPos = $chars.length;
      let pwd = '';
      for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd;
    },
    // 初始化上传配置
    initOssConfig(file, cb) {
      vodConfig({fileName: file.name, fileSize: file.size}).then(res => {
        if (res) {
          this.videoPlatType = res.vodPlatform // 1保利威、2百家云、3获得场景、4欢拓云、10私有云
          if (cb) {
            console.log(res);
            cb(res)
          }
        }
      }).catch(msg => {
        file.status = 'fail'
        this.uploading = false
        this.nextUpload && this.nextUpload();
        this.$message({
          type: 'error',
          message: this.errorMessage || msg.message
        })
      })
    },
    // 初始化保利威上传sdk
    initPolyv() {
      this.polyvClient = new PlvVideoUpload({
        events: {
          Error: (err) => { // 错误事件回调
            console.log(err);
            this.errorMessage = err.message
          },
          UploadComplete: () => {
          } // 全部上传任务完成回调
        }
      });
    },
    // 暂停上传
    stopUpload(_file) {
      this.uploading = false
      if (this.videoPlatType === 2) {
        _file.status = 'stop'
        this.polyvClient.stopAll()
      } else if (this.videoPlatType === 3) {
        if (this.cancelToken && this.cancelToken.cancel) {
          this.cancelToken.cancel()
        }
      } else {
        _file.status = 'stop'
        this.fenpianPause()
      }
    },
    // 继续上传
    resumeUpload(_file) {
      _file.status = 'uploading'
      if (this.videoPlatType === 2) {
        this.polyvClient.resumeFile(_file.uploadId)
      } else if (this.videoPlatType === 3) {
        this.baijiayunUpload(_file)
      } else {
        this.fenpianResume()
      }
    },
    // 获取保利威上传sign
    getPolyvVideoSign(res, cb) {
        if (!this.polyvClient) this.initPolyv()
        this.polyvClient.updateUserData({
          userid: res.userid, // Polyv云点播账号的ID
          ptime: res.ptime, // 时间戳，注意：系统时间不正确会导致校验失败
          sign: res.sign, // 是根据将secretkey和ts按照顺序拼凑起来的字符串进行MD5计算得到的值
          hash: res.hash // 是根据将ts和writeToken按照顺序拼凑起来的字符串进行MD5计算得到的值
        });
        if (cb) {
          cb()
        }
    },
    // polyv上传
    polyvUpload(_file) {
      console.log('polyvUpload', _file)
      const that = this
      const fileSetting = {
        title: undefined, // 标题
        desc: undefined, // 描述
        cataid: _file.polyvConfig.cataid, // 上传分类目录ID
        tag: 'course', // 标签
        luping: 1, //  是否录屏优化。当值为1时，上传的视频不再采取默认的压缩编码机制，视频尺寸不再压缩，保证视频的清晰度。默认值为0
        keepsource: 0, // 是否源文件播放（不对视频进行编码）：0为编码，1为不编码
        state: undefined // 用户自定义数据，如果提交了该字段，会在视频上传完成事件回调时透传返回。
      }
      that.polyvClient.clearAll()
      const uploader = that.polyvClient.addFile(
        _file.file, // file 为待上传的文件对象
        {
          FileStarted: function(uploadInfo) { // 文件开始上传回调
            console.log('文件上传开始: ' + uploadInfo.fileData.title);
          },
          FileProgress: function(uploadInfo) { // 文件上传过程返回上传进度信息回调
            console.log('FileProgress', uploadInfo)
            _file.status = 'uploading'
            _file.progress = parseInt(uploadInfo.progress * 100)
            console.log('文件上传中: ' + (uploadInfo.progress * 100).toFixed(2) + '%');
          },
          FileStopped: function(uploadInfo) { // 文件暂停上传回调
            _file.status = 'stop'
            that.uploading = false
            console.log('文件上传停止: ' + uploadInfo.fileData.title);
          },
          FileSucceed: function(uploadInfo) { // 文件上传成功回调
            that.uploading = false
            _file.status = 'success'
            _file.resourceUrl = uploadInfo.vid
            _file.progress = 100
            console.log('文件上传成功: ', uploadInfo.fileData);
            if (that.savaVideo) {
              that.savaVideo(Object.assign({materialName: _file.name, vid: uploadInfo.vid}, uploadInfo.fileData), _file)
            }
          },
          FileFailed: function(uploadInfo) { // 文件上传失败回调
            _file.status = 'fail'
            if (that.nextUpload) that.nextUpload()
            console.log('文件上传失败: ' + uploadInfo.fileData.title);
          }
        },
        fileSetting
      );
      const uploaderid = uploader.id;
      _file.uploadId = uploaderid
      this.polyvClient.resumeFile(uploaderid);
    },
    baijiayunUpload(_file, cb) {
      const _that = this
      // console.log(_stat)
      _that.cancelToken = {}
        // console.log(res)
        uploadBaijiayun(_file.file, _file.config.uploadUrl, (p) => {
          // console.log(p)
          _file.progress = parseInt(p)
          _file.status = 'uploading'
          if (cb) cb(parseInt(p))
        }, _that.cancelToken).then(result => {
          _that.uploading = false
          if (result.msg === 'success') {
            _file.status = 'success'
            _file.file = null;
            _that.savaVideo(Object.assign({
              vid: result.fid,
              materialName: _file.name
            }, _file), _file)
          } else {
            this.$message.error('上传失败')
            _file.status = 'fail'
            if (_that.nextUpload) _that.nextUpload()
          }
        }).catch((msgs) => {
          _that.uploading = false
          _file.status = 'fail'
          if (_that.nextUpload) _that.nextUpload()
          console.log('error', msgs)
        })
    }
  }
}
