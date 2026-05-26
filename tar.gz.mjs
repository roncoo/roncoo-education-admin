/**
 * 打包工具，将构建产物打包为 tar.gz 格式，输出文件为：admin.tar.gz
 */
import { createWriteStream } from 'fs'
import path from 'path'
import archiver from 'archiver'

const output = createWriteStream(path.resolve('./admin.tar.gz'))
const archive = archiver('tar', { gzip: true, gzipOptions: { level: 9 } })

archive.pipe(output)
archive.directory(path.resolve('dist'), '', null)
archive.finalize().then(() => {
  console.log('打包成功，请查看根目录下的：admin.tar.gz')
})
