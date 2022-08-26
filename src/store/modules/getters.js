const getters = {
  resetPassword: state => state.app.resetPassword,
  appLoading: state => state.app.appLoading,
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  menu: state => state.menu,
  menuArr: state => state.menu.menuArr,
  visitedViews: state => state.tags.visitedViews,
  cachedViews: state => state.tags.cachedViews
}
export default getters
