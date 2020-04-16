import { trim } from 'lodash'
// import { rules } from '@/views/crm/knowledgeMgt/document/components/document-utils'

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

export const isEmptyString = (value) => {
  return !value || trim(value) === ''
}

// TODO 集中控制校验规则

// common
export const getRequiredValidator = (name) => {
  const label = name || ''

  return [
    { required: true, message: `请输入${label}`, trigger: 'blur' }
  ]
}

export const getOptionValidator = (name) => {
  const label = name || ''

  return [
    { required: true, message: `请选择${label}`, trigger: 'change' }
  ]
}

export const getMultipleOptionsValidator = (name) => {
  const label = name || ''

  return [{ required: true, message: `请至少选择一个${label}`, type: 'array', trigger: 'change' }]
}

export const getAttachmentsValidator = () => {
  return [{ required: true, message: `请至少上传一个附件`, type: 'array', trigger: 'change' }]
}

// combined

export const getTitleValidator = (name) => {
  const label = name || '标题'

  return [
    ...getRequiredValidator(label),
    { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
  ]
}

export const getDataPartitionValidator = () => getMultipleOptionsValidator('管理类别')

export const validateData = (data, rules, disableValidator = false) => {
  debugger
  const ret = { isValid: true, messages: {}}

  for (const prop in rules) {
    if (rules[prop] instanceof Array) {
      rules[prop].forEach(item => {
        validItem(ret, prop, item, data[prop], disableValidator)
      })
    } else {
      validItem(ret, prop, rules[prop], data[prop], disableValidator)
    }
  }
  return ret
}
const validItem = (ret, prop, item, value, disableValidator) => {
  if (item.required && (!value && value !== 0 || value.length === 0)) {
    setErrorMessage(ret, prop, item)
  }
  if (!disableValidator && item.validator) {
    item.validator({}, value, (d) => {
      ret.isValid = false
    })
  }
}
const setErrorMessage = (ret, prop, item) => {
  if (!ret.messages[prop]) {
    ret.messages[prop] = []
  }
  ret.isValid = false
  ret.messages[prop].push({ message: item.message })
}
