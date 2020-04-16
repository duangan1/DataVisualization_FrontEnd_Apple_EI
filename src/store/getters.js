const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  userId: state => state.user.userId,
  name: state => state.user.name,
  userName: state => state.user.userName,
  fullName: state => state.user.fullName,

  userLang: state => state.user.userLang,
  userRoleIds: state => state.user.userRoleIds,
  userRoles: state => state.user.userRoles,

  visitedViews: state => state.tagsView.visitedViews,
  permission_routes: state => state.permission.routes,
  permission_menus: state => state.permission.menus,
  permission_buttons: state => state.permission.buttons,
  cachedViews: state => state.tagsView.cachedViews
}
export default getters
