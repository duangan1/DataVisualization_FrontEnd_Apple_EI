import defaultSettings from '@/settings'
// import Vue from 'vue'
import i18n from '@/i18n'
const title = defaultSettings.title || 'Vue Admin Template'

export default function getPageTitle(pageTitle) {
  console.log()
  if (i18n.te('route.' + pageTitle)) {
    pageTitle = i18n.tc('route.' + pageTitle)
  }
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}

export function updateTitle(page, title) {
  var tempRoute = Object.assign({}, page.$route)
  const route = Object.assign({}, tempRoute, {
    title: title
  })
  page.$store.dispatch('tagsView/updateVisitedView', route)
  document.title = title
}
