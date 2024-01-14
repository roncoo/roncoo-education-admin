import {defineStore} from 'pinia'

export const useTagsStore = defineStore('tags', {
  state: () => ({
    nameList: '',
    path: '',
    title: ''
  }),
  getters: {},
  actions: {}
})
