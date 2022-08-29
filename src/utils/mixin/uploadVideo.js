import OSS from 'ali-oss'
import SparkMD5 from 'spark-md5'
import {getPolyvVideoSign, getUploadConfig} from '@/api/system.js'

export default {
    data() {
        return {
            polyvClient: undefined, // 保利威SDK实例
            aliClient: undefined, // 阿里上传SDK实例
            aliResumeClient: undefined, // 阿里续传SDK实例
            tempCheckpoint: undefined, // 续传对象
            directoryPath: '',
            isBackupAli: false,
            ossType: 1, // 3 就是pdf 要设置动态读取 有权限读取 视频音频都是冷读取的一个月只读一次
            uploading: false,
            isPolyvUpload: false,
            uploadStatus: [],
            uploadList: []
        }
    },
    filters: {
        uploadStatus(val) {
            if (val === 2) {
                return '正在上传'
            } else if (val === 3) {
                return '上传成功'
            } else if (val === 4) {
                return '上传失败'
            } else if (val === 5) {
                return '上传暂停'
            } else if (val === 6) {
                return '正在保存'
            } else if (val === 7) {
                return '保存成功'
            } else if (val === 8) {
                return '保存失败'
            } else {
                return '等待上传'
            }
        }
    },
    mounted() {
        this.initOssConfig(this.type || 1)
    },
    methods: {
        receiveFile(files) {
            console.log(files)
            if (files.length) {
                for (let i = 0; i < files.length; i++) {
                    const file = {
                        name: files[i].name,
                        status: 1,
                        md5: '',

                        progress: 0 // 上传进度
                    }
                    this.uploadStatus.push(file);
                    this.uploadList.push(files[i])
                }

                this.uploadStatus.forEach((e, i) => {
                    if (!e.md5) {
                        this.getMd(this.uploadList[i], i)
                    }
                })
                // 开始上传
                this.uploading = true;
                this.startUpload()
            }
        },
        getMd(file, int) {
            const fileReader = new window.FileReader()
            const spark = new SparkMD5() // 创建md5对象（基于SparkMD5）
            fileReader.readAsBinaryString(file) // myfile 对应上传的文件
            // 文件读取完毕之后的处理
            fileReader.onload = (e) => {
                spark.appendBinary(e.target.result)
                const md5 = spark.end()
                this.uploadStatus[int].md5 = md5;
            }
        },
        uploadUploading() {
            let is = false;
            this.uploadStatus.forEach((e, i) => {
                if (e.status !== 7) {
                    is = true;
                }
            })
            this.uploading = is
        },
        startUpload() {
            let uploadNum = 0;
            const maxUploadNum = 5;
            console.log(this.uploadStatus);
            this.uploadStatus.forEach((e, i) => {
                if (e.status === 2) {
                    uploadNum++;
                }
            })
            this.uploadStatus.forEach((e, i) => {
                if (e.status === 1) {
                    if (uploadNum < maxUploadNum) {
                        uploadNum++;
                        e.status = 2
                        if (this.isPolyvUpload) {
                            this.polyvUpload(i)
                        } else {
                            this.multipartUpload(i)
                        }
                    }
                }
            })
        },
        stopAllUpload() {
            if (this.isPolyvUpload) {
                this.polyvClient.stopAll()
            } else {
                this.aliClient.cancel()
                this.aliResumeClient.cancel()
            }
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
        initOssConfig(type = 1) {
            getUploadConfig({}).then(res => {
                console.log(res);
                if (res.aliyunAccessKeyId) {
                    this.isPolyvUpload = false;
                    if (res.directory) {
                        this.directoryPath = res.directory + '/'
                    }
                    const ossConfig = {
                        // region以杭州为例（oss-cn-hangzhou），其他region按实际情况填写。
                        region: res.endPoint,
                        // 阿里云主账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM账号进行API访问或日常运维，请登录RAM控制台创建RAM账号。
                        accessKeyId: res.aliyunAccessKeyId,
                        accessKeySecret: res.aliyunccessKeySecret,
                        bucket: (type === 3 || type === 4) ? res.aliyunOssBucket : res.ossBucketVideo
                    }
                    this.aliClient = new OSS(ossConfig);
                    this.aliResumeClient = new OSS(ossConfig);
                    this.ossType = type;
                }
                this.isBackupAli = res.isBackupAli;
                if (!res.isBackupAli) {
                    this.isPolyvUpload = true;
                }
                this.initPolyv()
            }).catch(msg => {

            })
        },
        // 初始化保利威上传sdk
        initPolyv() {
            const PlvVideoUpload = require('@polyv/vod-upload-js-sdk').default;
            this.polyvClient = new PlvVideoUpload({
                events: {
                    Error: (err) => { // 错误事件回调
                        const errMsg = {
                            102: '用户剩余空间不足',
                            110: '上传的文件重复',
                            111: '拦截文件类型不在 acceptedMimeType 中的文件',
                            112: '文件已经开始上传或已上传完毕，禁止编辑文件信息'
                        }
                        if (err && errMsg[err.code]) {
                            this.$message.error(errMsg[err.code]);
                        }
                    },
                    UploadComplete: () => {
                    } // 全部上传任务完成回调
                }
            });
            this.getPolyvVideoSign()
        },
        // 暂停上传
        stopUpload(int = 0) {
            this.uploadStatus[int].status = 5
            if (this.polyvClient) {
                this.polyvClient.stopFile(this.uploadStatus[int].uploadId)
            } else {
                this.uploadStatus.forEach((e, i) => {
                    e.status = 5
                })
                this.aliClient.cancel()
                this.aliResumeClient.cancel()
            }
        },
        // 继续上传
        resumeUpload(int) {
            this.uploadStatus[int].status = 2
            if (this.polyvClient) {
                this.polyvClient.resumeFile(this.uploadStatus[int].uploadId)
            } else if (this.uploadStatus[int] && this.uploadStatus[int].isAliUpload) {
                this.aliResumeUpload(int)
            } else {
                this.multipartUpload(int)
            }
        },
        // 获取保利威上传sign
        getPolyvVideoSign() {
            getPolyvVideoSign({}).then(res => {
                this.polyvClient.updateUserData({
                    userid: res.userid, // Polyv云点播账号的ID
                    ptime: res.ptime, // 时间戳，注意：系统时间不正确会导致校验失败
                    sign: res.sign, // 是根据将secretkey和ts按照顺序拼凑起来的字符串进行MD5计算得到的值
                    hash: res.hash // 是根据将ts和writeToken按照顺序拼凑起来的字符串进行MD5计算得到的值
                });
                setTimeout(() => {
                    this.getPolyvVideoSign()
                }, 1000 * 60 * 2)
            })
        },
        // polyv上传
        polyvUpload(fileIndex) {
            const that = this
            const file = that.uploadList[fileIndex]
            const stat = that.uploadStatus[fileIndex]

            const fileSetting = {
                title: undefined, // 标题
                desc: undefined, // 描述
                cataid: undefined, // 上传分类目录ID
                tag: 'course', // 标签
                luping: 1, // 是否开启视频课件优化处理，对于上传录屏类视频清晰度有所优化：0为不开启，1为开启
                keepsource: 0, // 是否源文件播放（不对视频进行编码）：0为编码，1为不编码
                state: undefined // 用户自定义数据，如果提交了该字段，会在视频上传完成事件回调时透传返回。
            }
            const uploader = that.polyvClient.addFile(
                file, // file 为待上传的文件对象
                {
                    FileStarted: function (uploadInfo) { // 文件开始上传回调
                        stat.uploadId = uploadInfo.uploaderid
                        console.log(stat)
                        console.log('文件上传开始: ' + uploadInfo.fileData.title);
                    },
                    FileProgress: function (uploadInfo) { // 文件上传过程返回上传进度信息回调
                        stat.status = 2
                        stat.uploadId = uploadInfo.uploaderid
                        console.log(stat)

                        stat.progress = parseInt(uploadInfo.progress * 100)
                        if (that.uploadProgress) {
                            that.uploadProgress(uploadInfo.progress * 100)
                        }
                    },
                    FileStopped: function (uploadInfo) { // 文件暂停上传回调
                        stat.status = 5
                        console.log('文件上传停止: ' + uploadInfo.fileData.title);
                    },
                    FileSucceed: function (uploadInfo) { // 文件上传成功回调
                        stat.status = 3
                        console.log('文件上传成功: ');
                        that.startUpload()
                        if (that.uploadSuccess) {
                            that.uploadSuccess(uploadInfo.fileData, fileIndex)
                        }
                    },
                    FileFailed: function (uploadInfo) { // 文件上传失败回调
                        stat.status = 4
                        that.startUpload()
                        console.log('文件上传失败: ' + uploadInfo.fileData.title);
                    }
                },
                fileSetting
            );
            if (uploader) {
                const uploaderid = uploader.id;
                stat.uploadId = uploaderid
                this.polyvClient.resumeFile(uploaderid);
            } else {
                this.uploadStatus[fileIndex].status = 7;
            }
        },
        // ali-oss上传
        multipartUpload(fileIndex) {
            const file = this.uploadList[fileIndex]
            const stat = this.uploadStatus[fileIndex]
            const that = this
            console.log(file.type, file.name)
            const filename = file.name
            const index = filename.lastIndexOf('.');
            const suffix = filename.substr(index + 1)
            stat.fileName = this.randomString() + '.' + suffix
            stat.isAliUpload = true;
            // object-key可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。
            console.log(this.directoryPath + stat.fileName)
            this.aliClient.multipartUpload(this.directoryPath + stat.fileName, file, {
                progress: function (p, checkpoint) {
                    // 断点记录点。浏览器重启后无法直接继续上传，您需要手动触发上传操作。
                    that.tempCheckpoint = checkpoint;
                    console.log(checkpoint, p)
                    stat.progress = parseInt(p * 100)
                    stat.status = 2
                },
                // parallel: 5, // 分片数量
                // partSize: 1024 * 1024 * 40, // 分片大小
                meta: {year: 2020, people: 'test'},
                mime: file.type
            }).then(result => {
                stat.status = 3
                const url = result.res.requestUrls[0]
                if (that.ossType === 3) {
                    this.aliClient.putACL(result.name, 'private')
                }
                that.savaVideo(
                    {
                        ossUrl: url.substr(0, url.indexOf('?') === -1 ? url.length : url.indexOf('?')),
                        videoName: file.name
                    }, fileIndex);
                that.startUpload()
            }).catch(error => {
                console.error(error)
                if (error.status === 0) {
                    stat.status = 5
                } else {
                    stat.status = 4
                }
                that.startUpload()
            })
        },
        // ali-oss续传
        aliResumeUpload(fileIndex) {
            const file = this.uploadList[fileIndex]
            const stat = this.uploadStatus[fileIndex]
            const that = this
            stat.fileName = this.randomString() + '.' + file.type.substr(file.type.indexOf('/') + 1)
            // object-key可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。
            this.aliResumeClient.multipartUpload(this.directoryPath + stat.fileName, file, {
                progress: function (p, checkpoint) {
                    // 断点记录点。浏览器重启后无法直接继续上传，您需要手动触发上传操作。
                    that.tempCheckpoint = checkpoint;
                    // console.log(checkpoint, p)
                    stat.progress = parseInt(p * 100)
                    stat.status = 2
                },
                checkpoint: that.tempCheckpoint,
                meta: {year: 2020, people: 'test'},
                mime: file.type
            }).then(result => {
                stat.status = 3
                const url = result.res.requestUrls[0]
                if (that.ossType === 3) {
                    this.aliClient.putACL(result.name, 'private')
                }
                that.savaVideo(
                    {
                        ossUrl: url.substr(0, url.indexOf('?')),
                        videoName: file.name
                    }, fileIndex);
            }).catch(error => {
                if (error.status === 0) {
                    stat.status = 5
                } else {
                    stat.status = 4
                }
            })
        }
    }
}
