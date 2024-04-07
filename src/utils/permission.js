import { useUserStore } from '@/store/modules/user.js'

export function hasPermission(keyValue) {
  const permissions = useUserStore().getPermissionList
  if (!permissions?.includes(keyValue)) {
    return false
  }
  return true
}
