// 分片上传
import SimpleUploader from 'simple-uploader.js'

export const getSimpleClient = (userData) => {
  const simpleClient = new SimpleUploader({
    target: userData.uploadUrl,
    chunkSize: '2048000', // 分片大小，单位bytes，这里为2M
    simultaneousUploads: 5, // 并发上传数，默认为3
    maxChunkRetries: 3, // 上传失败重试次数，默认为0
    progressCallbacksInterval: 1000, // 上传进度回调间隔，单位ms，默认为500ms
    testChunks: true, // 是否要测试分片是否完整，默认为true
    checkChunkUploadedByResponse: function (chunk, message) {
      try {
        const objMessage = JSON.parse(message)
        if (objMessage.code === 200 && objMessage.data?.uploadStatusId === 2) {
          return true
        } else {
          return false
        }
      } catch (error) {
        console.error(error)
        return false
      }
    },
    query: {
      isChunk: true,
      ...userData
    }
  })
  return simpleClient
}

export const uploadSimple = (simpleClient, startFile, callback) => {
  simpleClient.on('fileAdded', function (file) {
    startFile.status = 'uploading'
    callback('FileStarted', file)
  })
  simpleClient.on('fileProgress', function (rootFile, file, chunk) {
    const uploadInfo = {
      progress: file.progress()
    }
    callback('FileProgress', uploadInfo)
  })
  simpleClient.on('fileSuccess', function (rootFile, file, message, chunk) {
    const uploadInfo = {
      vid: JSON.parse(message).data.videoVid
    }
    callback('FileSucceed', uploadInfo)
  })
  simpleClient.on('fileError', function (rootFile, file, message) {
    callback('FileFailed', message)
  })

  simpleClient.addFile(startFile.file)
  simpleClient.upload()
}
