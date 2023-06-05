
const state = {
  fileList: []
}

const mutations = {
  UPLOAD_FILE: (state, file) => {
    console.log(file)
    state.fileList.push(file)
  },
  REMOVE_LIST: (state) => {
    state.fileList = []
  },
  UPLOAD_FILE_STATUS: (state, file) => {
    state.fileList.map(item => {
      if (item.uid === file.uid) {
        item = file
      }
    })
  }
}

const actions = {
  uploadFile({commit}, file) {
    const _file = file.file
    const type = _file.type.split('/')
    const uploadInfo = {
      status: 'ready',
      name: _file.name,
      materialName: _file.name,
      materialSize: _file.size,
      size: _file.size,
      type: type[0],
      uid: _file.uid,
      progress: 0,
      visibleRange: 1,
      ...file
    }
    const nameType = _file.name.split('.')
    const nameTypes = nameType[nameType.length - 1]
      if (['3gp', 'asf', 'avi', 'dat', 'flv', 'f4v', 'm4v', 'mkv', 'mov', 'mp4', 'mpe', 'mpg', 'mpeg', 'rmvb', 'vob', 'wmv'].indexOf(nameTypes) > -1) {
        uploadInfo.resourceType = 1
      } else if (['aac', 'wav', 'wma', 'mp3'].indexOf(nameTypes) > -1) {
        _file.resourceType = 2
      } else if (['png', 'jpg', 'jpeg'].indexOf(nameTypes) > -1) {
        uploadInfo.resourceType = 4
      } else if (['zip', 'rar'].indexOf(nameTypes) > -1) {
        uploadInfo.resourceType = 5
        uploadInfo.type = 'zip'
      } else if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'ppt', 'pptx'].indexOf(nameTypes) > -1) {
        uploadInfo.resourceType = 3
        uploadInfo.type = 'document'
      }
    if (_file.type === '') {
      const name = _file.name.split('.')
      if (name[name.length - 1] === 'rar' || name[name.length - 1] === 'zip') {
        uploadInfo.type = 'zip'
      }
    }

    console.log(uploadInfo.type)
    commit('UPLOAD_FILE', uploadInfo)
  }
}
const getters = {
  fileList(state) {
    return state.fileList
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
