import { Boot } from '@wangeditor/editor'
import ImageMenu from './Custom/image.js'
import AiMenu from './module/menu/ai.js'
import { registerAiModule } from './module/module.js'

// 注册 AI 自定义节点插件
registerAiModule()

const MenusList = [
  {
    index: 20,
    key: 'ImageMenu',
    class: ImageMenu
  },
  {
    index: 99,
    key: 'AiMenu',
    class: AiMenu
  }
]

const registerMenu = function (editor, toolbarConfig) {
  const allRegisterMenu = editor.getAllMenuKeys()
  let keys = []
  for (let item of MenusList) {
    if (allRegisterMenu.indexOf(item.key) < 0) {
      const menuObj = {
        key: item.key,
        factory() {
          return new item.class()
        }
      }
      Boot.registerMenu(menuObj)
    }
    keys.push(item.key)
  }
  toolbarConfig.insertKeys = {
    index: MenusList[0].index,
    keys: keys
  }
}

export default registerMenu
