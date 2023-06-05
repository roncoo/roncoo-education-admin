// 私有化分片上传
import SimpleUploader from 'simple-uploader.js'
import BMF from 'browser-md5-file';

export default {
  data() {
    return {
      simpleClient: undefined, // 分片上传实例
      videoPlatType: null,
      vodModel: null,
      _simFileList: {}
    }
  },
  methods: {
    // 初始化分片上传实例
    initSimpleUpload(config) {
      console.log(config)
      if (this.simpleClient) return
      const that = this
      const bmf = new BMF();
      const uploader = new SimpleUploader({
        target: config.uploadUrl,
        chunkSize: '2048000',
        simultaneousUploads: 2000,
        fileParameterName: 'file',
        maxChunkRetries: 3,
        testChunks: true, // 是否开启服务器分片校验
        // 服务器分片校验函数，秒传及断点续传基础
        checkChunkUploadedByResponse: function(chunk, message) {
          let objMessage = {}
          try {
            objMessage = JSON.parse(message);
            console.log(objMessage)
          } catch (error) {
            console.log(error)
          }

          if (objMessage.code !== 200) {
            // ElMessage.error(objMessage.msg)
            // opts.FileId = chunk.file.id
            // const index = uploader.value.fileList.map((el) => el.id).indexOf(chunk.file.id)
            // itemRefs[index]._fileError()
            // statusSet(opts.FileId, 'progress');
          }
          if (objMessage.data?.uploadStatusId === 2) {
            return true;
          } else {
            return false;
          }
          // return objMessage.code === 200
        },
        headers: {
          token: that.$store.getters.token
          // Authorization: Ticket.get() && "Bearer " + Ticket.get().access_token
        },
        query: {
          isChunk: true,
          ...config
        }
      })
      if (!uploader.support) return
      this.simpleClient = uploader
      // 文件添加 单个文件
      uploader.on('fileAdded', function(file, event) {
        console.log(file, event)
        file.pause();
        that._simFileList[file.file.uid].status = 'md5'
        bmf.md5(
          file.file,
          (err, md5) => {
            console.log('err:', err);
            console.log('md5 string:', md5); // 97027eb624f85892c69c4bcec8ab0f11

            file.uniqueIdentifier = md5;
            console.log(uploader)
            file.resume();
          },
          // progress => {
          //   console.log('progress number:', progress);
          //   const _file = that._simFileList[file.file.uid]
          //   _file.status = 'transcoding'
          //   _file.progress = parseInt((progress) * 100)
          // },
        );

        // file.upload()
        // that.computeMD5(file);
      })
  // 单个文件上传成功
      uploader.on('fileSuccess', function(rootFile, file, message) {
        console.log(rootFile, file, message)
        const resultMsg = JSON.parse(message)
        that._simFileList[file.file.uid].status = 'success'
        if (that.savaVideo) {
          that.savaVideo(Object.assign({materialName: file.name, vid: resultMsg.data.videoVid}, resultMsg.data), that._simFileList[file.file.uid])
        }
      })
      uploader.on('fileProgress', function(rootFile, file, chunk) {
        const _file = that._simFileList[file.file.uid]
        _file.status = 'uploading'
        _file.progress = parseInt((file.progress()) * 100)
      })
  // 根下的单个文件（文件夹）上传完成
      uploader.on('fileComplete', function(rootFile) {
        console.log(rootFile)
      })
  // 某个文件上传失败了
      uploader.on('fileError', function(rootFile, file, message) {
        console.log(rootFile, file, message)
      })
    },
    // 分片上传
    fenpianUpload(file, videoPlatType) {
      this.videoPlatType = videoPlatType
      this.vodModel = file.vodModel
      this._simFileList[file.uid] = file;
      this.simpleClient.addFile(file.file)
    },
    fenpianPause() {
      this.simpleClient.pause()
    },
    fenpianResume() {
      this.simpleClient.resume()
    }
  }
}
