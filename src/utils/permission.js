import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkButtonPermission(value, disabled = true) {
  if (!disabled) {
    return false
  }
  if (value && value instanceof Array && value.length > 0) {
    const permissionButtons = store.getters && store.getters.permission_buttons
    const checkedPermissions = value

    const hasPermission = permissionButtons.some(button => {
      return checkedPermissions.includes(button)
    })

    if (!hasPermission) {
      return false
    }
    return true
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}
