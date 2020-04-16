import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { getLang } from '@/utils/auth'

// import elementUi from 'element-ui'
import elementEN from 'element-ui/lib/locale/lang/en'
import elementzhCN from 'element-ui/lib/locale/lang/zh-CN'
import ElementLocale from 'element-ui/lib/locale'
import en from './lang/en'
import zhCN from './lang/zhCN'
Vue.use(VueI18n)

const messages = {
  'zhCN': {
    ...elementzhCN,
    ...zhCN
  },
  'en': {
    ...elementEN,
    ...en
  }
}

const i18n = new VueI18n({
  locale: getLang(),
  messages: messages
})

ElementLocale.i18n((key, value) => i18n.t(key, value))

export default i18n
