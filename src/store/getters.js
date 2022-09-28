const getters = {
  resetPassword: state => state.app.resetPassword,
  appLoading: state => state.app.appLoading,
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  language:  state => state.app.language,
  user: state => state.user,
  token: state => state.user.token,
  userInfo: state => state.user.userInfo,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  menu: state => state.menu,
  menuArr: state => state.menu.menuArr,
  menuInit: state => state.menu.init,
  visitedViews: state => state.tags.visitedViews,
  cachedViews: state => state.tags.cachedViews,
  userPermission: state => state.permission.userPermission,
  imageVerification : state => state.app.loginImageVerification
}
export default getters
