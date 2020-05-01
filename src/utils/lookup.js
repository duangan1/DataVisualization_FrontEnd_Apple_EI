import * as lookupApi from '@/api/core/system/lookup'
import { getLang } from '@/utils/auth'
export async function queryLookup(lookupTypes) {
  if (!Array.isArray(lookupTypes)) {
    return
  }
  const lookups = {}
  const lang = getLang()
  const queryTypes = []
  lookupTypes.forEach(function(type) {
    const item = sessionStorage.getItem(type + '_' + lang)
    if (item != null) {
      lookups[type] = JSON.parse(item)
    } else {
      queryTypes.push(type)
    }
  })
  if (queryTypes.length) {
    let receivedItem = []
    await lookupApi.queryLookupCode(queryTypes, lang).then(response => {
      receivedItem = response.data
    })
    for (const key in receivedItem) {
      const value = receivedItem[key]
      lookups[key] = value
      sessionStorage.setItem(key + '_' + lang, JSON.stringify(value))
    }
  }
  return lookups
}

export async function queryDynamicLookup(entities) {
  if (!Array.isArray(entities)) {
    return
  }
  let lookups = {}
  await lookupApi.queryDynamicLookup(entities).then(response => {
    lookups = response.data
  })
  return lookups
}

export async function querySteelSerial() {
  let steelSerialLookup = []
  await lookupApi.querySteelSerialLookup().then(response => {
    steelSerialLookup = response.data
  })
  return steelSerialLookup
}

export function queryLookupLabel(lookupType, lookupValue) {
  let lookupLabel = ''

  lookupType.forEach(lookup => {
    if (lookup['value'] === lookupValue) {
      lookupLabel = lookup['label']
      return
    }
  })
  return lookupLabel === '' ? lookupValue : lookupLabel
}

export function queryLookupValue(lookupType, lookupLabel) {
  let lookupValue = ''

  lookupType.forEach(lookup => {
    if (lookup['label'] === lookupLabel) {
      lookupValue = lookup['value']
      return
    }
  })
  return lookupValue === '' ? lookupLabel : lookupValue
}

export const LOOKUP_KEY = {
  Principal: 'principal',
  DataPartition: 'DATA_BELONG',
  DataBelong: 'DATA_BELONG',
  DocumentKeywords: 'DOC_MGT_KEYWORDS',
  DocumentType: 'DOC_MGT_CATEGORY',
  ArticleKeywords: 'ARTICLE_MGT_KEYWORDS',
  ArticleType: 'ARTICLE_MGT_CATEGORY',
  ComplainType: 'CC_CATEGORY',
  ComplainStaus: 'CC_STATUS',
  ApprovedResult: 'APPR_RESULT',
  IndustryType: 'INDUSTRY_TYPE',
  CompanyType: 'COMPANY_TYPE',
  CustomerStatus: 'CUSTOMER_STATUS',
  CustomerType: 'CUSTOMER_TYPE',
  PersonDemand: 'CUSTOMER_PERSONAL_DEMAND',
  SteelFacRate: 'CUSTOMER_STEEL_FAC_RATE_RESULT',
  QuestionnaireType: 'QUESTIONNAIRE_MGT_CATEGORY',
  DissentRegion: 'DISSENT_REGION',
  DissentStatus: 'DISSENT_STATUS',
  SalutationType: 'SALUTATION_TYPE',
  MaintainType: 'MAINTAIN_TYPE',
  MaintainReason: 'MAINTAIN_REASON',
  MaintainCategory: 'MAINTAIN_CATEGORY',
  ProductType: 'PRODUCT_TYPE',
  ProcessUsage: 'PROCESS_USAGE',
  DeliveryStatus: 'DELIVERY_STATUS',
  ReplyAndVerifyStatus: 'COMPLAIN_REPLY_VERIFY_STATUS',
  YesOrNo: 'YES_NO',
  ReformStatus: 'COMPLAIN_REFORM_STATUS',
  ReformProcess: 'COMPLAIN_REFORM_PROCESS',
  EvalStatus: 'COMPLAIN_EVAL_STATUS',
  CreatedStatus: 'COMPLAIN_CREATED_STATUS',
  GenerateSource: 'RECORD_GENERATE_SOURCE',
  ServiceType: 'SP_PROJECT_CATEGORY'
}

export const DYNAMIC_LOOKUP_KEY = {
  customer: 'customer'
}

export const getLabel = (key, options) => {
  const option = options.find(item => item.value === key || String(item.value) === String(key))
  return option ? option.label : key
}

export const getLabels = (keys, options) => {
  return keys.map(key => getLabel(key, options))
}

export const filterLabels = (keys, options) => {
  return options.filter(option => keys.findIndex(key => key === option.value) > -1)
}

export async function querySysConfig(key) {
  let sysValue = ''
  await lookupApi.getSysConfig(key).then(response => {
    sysValue = response.data
  })
  return sysValue
}
