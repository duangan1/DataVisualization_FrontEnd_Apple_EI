import Cookies from 'js-cookie'

const TokenKey = 'security_token'
const LangKey = 'lang_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function getLang() {
  const lang = Cookies.get(LangKey)
  return lang == null ? 'en' : lang
}

export function setToken(token) {
  const jwt = token.substring(token.indexOf('.') + 1, token.lastIndexOf('.'))
  var result2 = JSON.parse(atob(jwt))
  result2.FullName = decodeURIComponent(escape(window.atob(result2.FullName)))
  for (const pro in result2.Roles) {
    const pro1 = decodeURIComponent(escape(window.atob(pro)))
    result2.Roles[pro1] = true
    delete result2.Roles[pro]
  }
  return Cookies.set(TokenKey, token)
}

export function setLang(lang) {
  return Cookies.set(LangKey, lang)
}
export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function removeToLang() {
  return Cookies.remove(LangKey)
}
