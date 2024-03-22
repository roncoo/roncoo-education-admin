export default class ImageMenu {
  constructor() {
    this.title = '选择图片' // 自定义菜单标题
    this.iconSvg =
      '<svg t="1710986184014" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4528" width="200" height="200"><path d="M335.36 440.32c38.4 0 71.68-30.72 71.68-71.68 0-38.4-30.72-71.68-71.68-71.68-38.4 0-71.68 30.72-71.68 71.68 2.56 40.96 33.28 71.68 71.68 71.68z m0 0" fill="" p-id="4529"></path><path d="M652.8 396.8L445.44 691.2l-107.52-151.04-179.2 253.44h704l-209.92-396.8z m0 0" fill="" p-id="4530"></path><path d="M934.4 107.52h-844.8c-20.48 0-35.84 15.36-35.84 35.84v739.84c0 20.48 15.36 35.84 35.84 35.84h844.8c20.48 0 35.84-15.36 35.84-35.84V143.36c0-20.48-15.36-35.84-35.84-35.84z m-35.84 739.84H125.44V176.64h775.68v670.72h-2.56z m0 0" fill="" p-id="4531"></path></svg>' // 可选
    this.tag = 'button'
  }

  // 获取菜单执行时的 value ，用不到则返回空 字符串或 false
  getValue(editor) {
    return ''
  }

  // 菜单是否需要激活（如选中加粗文本，“加粗”菜单会激活），用不到则返回 false
  isActive(editor) {
    return false
  }

  // 菜单是否需要禁用（如选中 H1 ，“引用”菜单被禁用），用不到则返回 false
  isDisabled(editor) {
    return false
  }

  // 点击菜单时触发的函数
  exec(editor, value) {
    if (this.isDisabled(editor)) return
    editor.emit('PicMenuClick', value)
  }
}
