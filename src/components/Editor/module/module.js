import { Boot } from '@wangeditor/editor'
import AiParseElemHtml from '@/components/Editor/module/plugin/ai/parse-elem-html.js'
import AiElemToHtml from '@/components/Editor/module/plugin/ai/elem-to-html.js'
import AiRenderElem from '@/components/Editor/module/plugin/ai/render-elem.js'

// 注册自定义菜单到编辑器工具栏
export const registerMenu = function (editor, toolbarConfig, menusList) {
  const allRegisterMenu = editor.getAllMenuKeys()
  let keys = []
  for (let item of menusList) {
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
    index: menusList[0].index,
    keys: keys
  }
}

// 注册 AI 自定义节点插件
const module = {
  parseElemsHtml: [AiParseElemHtml],
  elemsToHtml: [AiElemToHtml],
  renderElems: [AiRenderElem]
}
Boot.registerModule(module)
