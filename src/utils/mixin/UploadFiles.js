
import {uploadDoc, uploadPic} from '@/api/upload'
export default {
  data() {
    return {
      filePlatType: 2, // 存储品台， 1：阿里云，2：本地存储（MinIO）
      aliFileClient: undefined, // 阿里上传SDK实例
      aliFileResumeClient: undefined, // 阿里续传SDK实例
      tempFileCheckpoint: undefined, // 续传对象
      fileDirectoryPath: '',
      aliyunOssUrl: '',
      fileUploading: false,
      cancelToken: {},
      type: 1
    }
  },
  mounted() {
    // this.initFileOssConfig()
  },
  methods: {
    // 初始化oss上传配置
    // initFileOssConfig() {
    //   getUploadConfig({}).then(({data}) => {
    //     const res = data
    //     // 1: 阿里云OSS， 2： MinIO(本地存储)
    //     this.filePlatType = res.fileStorageType
    //     if (this.filePlatType === 1) {
    //       if (res.directory) {
    //         this.fileDirectoryPath = res.directory + '/'
    //       }
    //       this.aliyunOssUrl = res.aliyunOssUrl
    //       const ossConfig = {
    //         // region以杭州为例（oss-cn-hangzhou），其他region按实际情况填写。
    //         region: res.endPoint,
    //         // 阿里云主账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM账号进行API访问或日常运维，请登录RAM控制台创建RAM账号。
    //         accessKeyId: res.aliyunAccessKeyId,
    //         accessKeySecret: res.aliyunccessKeySecret,
    //         bucket: res.aliyunOssBucket
    //       }
    //       this.aliFileClient = new OSS(ossConfig);
    //       this.aliFileResumeClient = new OSS(ossConfig);
    //     }
    //   }).catch(msg => {
    //
    //   })
    // },
    // 暂停上传
    stopUploadFile(_file) {
      if (this.type === 1) {
        console.log(this.cancelToken)
        if (this.cancelToken && this.cancelToken.cancel) {
          this.cancelToken.cancel()
        }
      } else {
        _file.status = 'stop'
        this.aliClient && this.aliClient.cancel()
        this.aliResumeClient && this.aliResumeClient.cancel()
      }
    },
    // 上传本地（doc）
    UploadDoc(_file, callback) {
      this.type = 1
      console.log('_file', _file)
      const that = this
      that.cancelToken = {}
      const form = new FormData()
      form.append('docFile', _file.file)
      uploadDoc(form, (p) => {
        _file.progress = p
        _file.status = 'uploading'
      }, that.cancelToken).then(res => {
        const _data = {
          materialUrl: res.fileUrl,
          materialName: _file.name,
          pageCount: res.pageCount,
          entConfigType: 1,
          ...res
        }
        console.log(res, _data)
        if (that.saveFile) that.saveFile(_data, _file);
        if (callback) callback(_data)
      }).catch(() => {
        _file.status = 'saveFail'
      })
    },
    getWidthHeight(file) {
      return new Promise((resolve) => {
        var reader = new FileReader();
        reader.readAsDataURL(file.file);
        reader.onload = function() { // 让页面中的img标签的src指向读取的路径
          var img = new Image()
          img.src = reader.result
          if (img.complete) { // 如果存在浏览器缓存中
            file.width = img.width
            file.height = img.height
          } else {
            img.onload = function() {
              file.width = img.width
              file.height = img.height
              resolve(file)
            }
          }
        }
      })
    },
    // 上传本地（minIO）
    UploadFile(file, callback) {
      this.getWidthHeight(file).then(_file => {
      this.type = 1
      console.log('_file', _file)
      const that = this
      that.cancelToken = {}
      const form = new FormData()
      form.append('picFile', _file.file)
      uploadPic(form, (p) => {
        _file.progress = p
        _file.status = 'uploading'
      }, that.cancelToken).then(res => {
        const _data = {
          materialUrl: res.fileUrl,
          materialName: _file.name,
          width: _file.width,
          height: _file.height,
          entConfigType: 1,
          ...res
        }
        console.log(res, _data)
        if (that.saveFile) that.saveFile(_data, _file);
        if (callback) callback(_data)
      }).catch(() => {
        _file.status = 'fail'
      })
      })
    },
    // ali-oss上传
    multipartUploadFile(_file, callback) {
      const that = this
      if (that.fileUploading) {
        return
      }
      that.fileUploading = true
      if (this.filePlatType === 2) {
        this.minIOUploadFile(_file, callback)
        return false
      }
      _file.fileName = this.fileRandomString() + '.' + _file.file.type.substr(_file.file.type.indexOf('/') + 1)
      _file.isAliUpload = true;
      // object-key可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。
      console.log(this.fileDirectoryPath + _file.fileName)
      this.aliFileClient.multipartUpload(this.fileDirectoryPath + _file.fileName, _file.file, {
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
        if (callback) callback(_data)
      }).catch(error => {
        that.fileUploading = false
        that.uploading = false
        console.error(error)
        if (error.status === 0) {
          _file.status = 'stop'
        } else {
          _file.status = 'fail'
        }
        if (callback) callback()
      })
    },
    // ali-oss续传
    aliResumeUploadFile(_file, callback) {
      const that = this
      // object-key可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。
      this.aliFileResumeClient.multipartUpload(this.fileDirectoryPath + _file.fileName, _file.file, {
        progress: function(p, checkpoint) {
          // 断点记录点。浏览器重启后无法直接继续上传，您需要手动触发上传操作。
          _file.tempCheckpoint = checkpoint;
          _file.progress = parseInt(p * 100)
          _file.status = 'uploading'
        },
        checkpoint: that.tempCheckpoint,
        meta: { year: 2020, people: 'test' },
        mime: _file.file.type
      }).then(result => {
        _file.status = 'success'
        _file.file = undefined;
        _file.tempCheckpoint = undefined;
        // 3 就是pdf 要设置动态读取 有权限读取 视频音频都是冷读取的一个月只读一次
        if (_file.type === 'pdf') {
          this.aliFileClient.putACL(result.name, 'private')
        }
        const fileUrl = that.aliyunOssUrl + result.name
        const _data = {
          url: fileUrl,
          name: _file.file.name
        }
        if (that.saveFile) that.saveFile(_data, _file);
        if (callback) callback(_data)
      }).catch(error => {
        if (error.status === 0) {
          _file.status = 'stop'
        } else {
          _file.status = 'fail'
        }
      })
    },
    fileRandomString(len = 32) {
      const $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';
      const maxPos = $chars.length;
      let pwd = '';
      for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd;
    }
  }
}
