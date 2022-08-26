const fs = require('fs')
const rimraf = require('rimraf');

/**
 * 删除文件夹
 * @param path
 */
function deleteFolder (path) {
  let files = [];
  if (fs.existsSync(path)) {
    if (fs.statSync(path).isDirectory()) {
      files = fs.readdirSync(path)
      files.forEach((file) => {
        const curPath = path + '/' + file;
        if (fs.statSync(curPath).isDirectory()) {
          deleteFolder(curPath)
        } else {
          fs.unlinkSync(curPath)
        }
      })
      fs.rmdirSync(path)
    } else {
      fs.unlinkSync(path)
    }
  }
}

/**
 * 使用 rimraf 删除文件夹
 * @param path
 */
function deleteFolderByRimraf (path) {
  rimraf(path, (err) => {
    if (err) {
      console.log(err)
    }
  })
}

/**
 * 删除文件
 * @param path
 */
function deleteFile (path) {
  if (fs.existsSync(path)) {
    if (fs.statSync(path).isDirectory()) {
      deleteFolder(path)
    } else {
      fs.unlinkSync(path)
    }
  }
}

/**
 * 复制文件夹到指定目录
 * @param from
 * @param to
 */
function copyFolder (from, to) {
  let files = []
  // 文件是否存在 如果不存在则创建
  if (fs.existsSync(to)) {
    files = fs.readdirSync(from)
    files.forEach((file) => {
      const targetPath = from + '/' + file;
      const toPath = to + '/' + file;

      // 复制文件夹
      if (fs.statSync(targetPath).isDirectory()) {
        copyFolder(targetPath, toPath)
      } else {
        // 拷贝文件
        fs.copyFileSync(targetPath, toPath)
      }
    })
  } else {
    fs.mkdirSync(to)
    copyFolder(from, to)
  }
}

module.exports = {
  deleteFolder,
  deleteFolderByRimraf,
  deleteFile,
  copyFolder
}
