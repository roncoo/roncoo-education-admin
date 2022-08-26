const fs = require('fs')
const p = require('path')

const nodeModulesPath = p.join(__dirname, '../../node_modules')
const lockJsonPath = p.join(__dirname, '../../package-lock.json')
const lockYarnPath = p.join(__dirname, '../../yarn.lock')

if (fs.existsSync(nodeModulesPath)) {
  const file = require('./file')

  file.deleteFolderByRimraf(nodeModulesPath)
  console.log('delete node_modules success')

  file.deleteFile(lockJsonPath)
  console.log('delete package-lock.json success')

  file.deleteFile(lockYarnPath)
  console.log('delete yarn.json success')
}
