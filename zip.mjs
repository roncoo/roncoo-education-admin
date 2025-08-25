/**
 * 打包工具，方便将打包后的dist进行管理，打包后的文件为：admin.zip
 */
import { createWriteStream } from 'fs'
import path from 'path'
import archiver from 'archiver'

const output = createWriteStream(path.resolve('./admin.zip'))
const archive = archiver('zip', { zlib: { level: 9 } })

archive.pipe(output)
archive.directory(path.resolve('dist'), '', null)
archive.finalize().then(() => {
  console.log('打包成功，请查看根目录下的：admin.zip')
})
